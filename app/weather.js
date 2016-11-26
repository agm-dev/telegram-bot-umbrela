'use strict';
// Weather object:

const ow = require('./open-weather-api.js');
const bot = require('./telegram-bot.js'); // Funcionará??

const weather = {
    // Just two methods:
    currentWeatherAlert: () => {
        // Reads current weather and alert if it's raining
        // or if it was raining but stopped.

        // Get from database all subscriptions documents:
        // TODO:

        // Group each ID on an array and perform a request:
        // TODO:
        ow.getCurrentWeather([6359344], (weatherInfo) => {
            console.log(weatherInfo);
            // TODO: al recibir los datos de las ciudades mirar si en alguna llueve
            // si es así, mirar en los suscriptores de esa ciudad y enviar un mensaje
            // a todos avisando de que llueve.
            // IMPORTANTE: añadir al esquema de suscripción el campo estado actual
            // con la idea de que contenga el tiempo actual. En cada medición se compara
            // con ese campo y si ha cambiado a lluvia se avisa, pero si ya era lluvia
            // no se avisa, y si era lluvia y ahora es otra cosa (sol?) también se avisa
        });

    },
    forecastAlert: () => {
        // Reads forecast weather for next hours and
        // alerts users if some rain is expected.
        // TODO:
    }
};

module.exports = weather;
