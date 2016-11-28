'use strict';
// Weather object:

const ow = require('./open-weather-api.js');
const bot = require('./telegram-bot.js'); // Funcionará??
const Subscription = require('./subscriptions.js');
const AlertCodes = require('./alert-codes.js');

const weather = {
    subscriptions: [],
    currentWeatherAlert: () => {
        // Reads current weather and alert if it's raining
        // or if it was raining but stopped.

        // Get from database all subscriptions documents with subscribers:
        Subscription.find( {'subscribers.0': { '$exists': true } } ).
        exec( (err, results) => {
            if (err) return console.log('Error trying to read database, subscribers collection');
            if (results.length <= 0) return console.log('There is no subscriptions to analize');
            console.log('Building open weather query for ' + results.length + ' cities');

            // Store query data into the object.
            weather.subscriptions = results;

            // Group each ID on an array and perform a request:
            let citiesIds = Array();
            for (let result of results) {
                citiesIds.push(result._id);
            }
            console.log(citiesIds);
            ow.getCurrentWeather(citiesIds, (weatherInfo) => {
                // Then checks weather in data for each city.
                // If there was only 1 city, a direct object is returned
                // If there were more than 1 city, the city object is inside
                // an array 'list' on main object returned.
                let wi = Array();
                if (weatherInfo.hasOwnProperty('list') && Array.isArray(weatherInfo.list)) {
                    wi = weatherInfo.list;
                } else {
                    wi.push(weatherInfo);
                }
                // TODO: verify weatherInfo openweather return is valid data.
                console.log('wi:');
                console.log(wi);

                // Now wi should be always an array with one or more weatherInfo objects.
                for (let city of wi) {
                    console.log('Debug: city.weather[0].id: ' + city.weather[0].id);
                    // Checks city.weather.id
                    if ( AlertCodes.indexOf(city.weather[0].id) >= 0 ) {
                        weather.alertOnStartRaining(city.id, city.weather[0].description);
                    } else {
                        weather.alertOnStopRaining(city.id, city.weather[0].description);
                    }
                }
            });

        });
    },
    alertOnStartRaining: (cityId, weatherDescription) => {
        console.log('Debug: alertOnStartRaining execution');
        // Then it is 'raining', so check the Subscription.rain state.
        // If it was false, then alert user it is raining now, and update that field.
        for (let sub of weather.subscriptions) {
            if (sub._id === cityId && !sub.rain) {
                // Update that field on database:
                Subscription.update(
                    {'_id': sub._id},
                    { '$set': {rain: true} }
                ).exec( (err) => {
                    if (err) return console.log('Error on updating rain field for document ' + sub._id + ' on subscriptions');
                    // Alert sub.subscribers
                    let text =  'Ha empezado a llover en ' + sub.name + ' (' + sub.country + '). '+
                                'Concretamente se ha descrito el tiempo como: ' +
                                weatherDescription.toLowerCase();

                    weather.alertSubscribers(sub.subscribers, text);
                });
            }
        }
    },
    alertOnStopRaining: (cityId, weatherDescription) => {
        // TODO: this does the same that alertOnStartRaining:
        /* merge in 1 function who listen param start/stop and do one
        or another thing*/
        console.log('Debug: alertOnStopRaining execution');
        // It is not 'raining', so check the Subscription.rain state.
        // If it was true, then alert user it is not raining anymore and update the field.
        for (let sub of weather.subscriptions) {
            if (sub._id === cityId && sub.rain) {
                // Update that field on database:
                Subscription.update(
                    {'_id': sub._id},
                    { '$set': {rain: false} }
                ).exec( (err) => {
                    if (err) return console.log('Error on updating rain field for document ' + sub._id + ' on subscriptions');
                    // Alert sub.subscribers
                    let text =  'Ha dejado de llover en ' + sub.name + ' (' + sub.country + '). '+
                                'Concretamente se ha descrito el tiempo como: ' +
                                weatherDescription.toLowerCase();

                    weather.alertSubscribers(sub.subscribers, text);
                });
            }
        }
    },
    alertSubscribers: (subscribers, message) => {
        console.log('Debug: alerting subscribers');
        for (let subscriber of subscribers) {
            bot.sendMessage(subscriber._id, message);
        }
    },
    forecastAlert: () => {
        // Reads forecast weather for next hours and
        // alerts users if some rain is expected.
        // TODO:
    }
};

module.exports = weather;
