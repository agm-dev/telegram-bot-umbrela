# Umbrela Telegram bot

This is a personal project to test node js with telegram bots and external apis (open weather).

The bot allows you to subscribe to raining alerts on cities, so when open weather says it is raining there, the bot sends you a telegram message to alert you, and another one when it stops raining.

The code requires api keys from telegram and openweather, and they have to be included in the `app/keys` directory in two files:
- `umbrela-telegram-key.js`
- `open-weather-key.js`

These files just declare and exports the keys like this:
```
const apiKey = 'ultraSuperSecretKey';
module.exports = apiKey;
```

Ideally all these enviroment variables should be declared using dotenv npm package, but who knew about this 10 months ago...

# Example:

[@umbrelaBot](https://telegram.me/umbrelaBot) is a running implementation of this code.
