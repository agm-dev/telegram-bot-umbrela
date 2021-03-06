'use strict';
// Requires:
const db = require('./app/db.js');
//const webServer = require('./app/server.js');
const umbrela = require('./app/umbrela.js');
const bot = require('./app/telegram-bot.js');
const weather = require('./app/weather.js');

// Main thread:

// Init interval to look for weather in time:
console.log('Debug: Set interval for current weather');
setInterval( () => {
    console.log('Debug: Interval for current weather execution');
    weather.currentWeatherAlert();
}, 1000 * 60 * 10); // Executes every 10 minutes.

// Init interval to look for weather forecast:
//setInterval(weatherForecast, 1000 * 60 * 60 * 3); // Executes every 3 hours.

// Init http server to accept subscriptions from Telegram bot:
/*
var port = 8443; // Ports suported for Telegram bot api for webhooks: 443, 80, 88, 8443.
webServer.listen(port, function(){
    console.log("Umbrela's web server is listening on port "+ port);
});
*/
console.log('Debug: connecting bot...');
bot.connect();
