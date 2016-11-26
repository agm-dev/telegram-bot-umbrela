'use strict';
// Allows comunication with open weather api:
const http = require('http'); // To perform http requests.
const apiKey = require('./keys/open-weather-key.js');

const ow = {
    api: {
        key: apiKey,
        url: 'http://api.openweathermap.org/data/',
        version: '2.5',
        options: {
            units: 'metric',
            lang: 'es'
        }
    },
    getCurrentWeather: (array, cb) => {
        if (!Array.isArray(array)) return console.log('getCurrentWeather: array expected as param');
        if (array.length <= 0) return console.log('getCurrentWeather: array need one or more city ids');
        let endpoint = ow.api.url + ow.api.version + '/';
        if (array.length <= 1) {
            // Use endpoint for one city:
            endpoint += 'weather?id=' + array[0];
        } else {
            // Use endpoint for multiple cities:
            endpoint += 'group?id=' + array.join(',');
        }

        // Add options and apiKey:
        endpoint += '&units=' + ow.api.options.units + '&lang=' + ow.api.options.lang;
        endpoint += '&appid=' + ow.api.key;

        // Make the request:
        http.get(endpoint, (res) => {
            httpResponseHandler(res, cb);
        }).on('error', (e) => {
            console.log('Error: ' + e.message);
        });
    },
    getWeatherForecast: (city, cb) => {
        if (!city) return console.log('getWeatherForecast: expected param');
        let endpoint = ow.api.url + ow.api.version;
        endpoint += '/forecast?id=' + city;
        endpoint += '&units=' + ow.api.options.units + '&lang=' + ow.api.options.lang;
        endpoint += '&appid=' + ow.api.key;

        // Make the request:
        http.get(endpoint, (res) => {
            httpResponseHandler(res, cb);
        }).on('error', (e) => {
            console.log('Error: ' + e.message);
        });
    }
};

// Functions:
function httpResponseHandler(res, cb) {
    if (res.statusCode !== 200) return console.log('Request for weather forecast has failed');
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
        try {
            let parsedData = JSON.parse(rawData);
            console.log(parsedData);
            if (cb) cb(parsedData);
        } catch (e) {
            console.log(e.message);
        }
    });
}

module.exports = ow;
