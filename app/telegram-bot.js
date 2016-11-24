'use strict';
//// Telegram bot ////

// Requires:
const Telebot = require('telebot');
const mongoose = require('mongoose');
const City = require('./cities.js');
const Subscription = require('./subscriptions.js');

const bot = new Telebot({
    token: '297491356:AAGuY2UNpyEApp5x7CwZEimRhu6UZSkTu8A',
    polling: {
        interval: 1000,
        timeout: 0,
        limit: 100,
        retryTimeout: 5000
    }/*,
    webhook: {
        key: './certificates/private.key',
        cert: './certificates/public.pem',
        url: 'https://brainl.es',
        port: 8443
    },
    modules: {

    }*/
});

// Events and behaviour:
bot.on('/subscribe', msg => {
    let parse = 'html';
    console.log(msg);

    if (msg.text === '/subscribe') return bot.sendMessage(msg.chat.id, 'Para poder suscribirte a las alertas de tiempo necesito que me indiques la ciudad o localidad de la que quieres recibir las alertas :) Por ejemplo, escribe <i>/subscribe madrid</i> para recibir alertas de mal tiempo en Madrid. Puedes indicar varias ciudades separadas por comas.', { parse });

    let cities = msg.text.replace(/^\/subscribe/gi, '').split(',');
    console.log(cities);

    for (let city of cities) {
        // Look for them on cities collection:
        city = city.trim();
        if (city.length <= 0) continue;
        console.log(city);

        // If user writes a city ID:
        if (!Number.isNaN( parseInt( city ) )) {
            City.findOne({
                _id: city
            }).
            select({ name: 1, country: 1}).
            exec( (err, city) => {
                console.log(city);
                if (err) return bot.sendMessage(msg.chat.id, 'Uy... Parece que ha habido algún error al intentar suscribirte :( Habla con @adriangm si el problema persiste.');
                if (!city) return bot.sendMessage(msg.chat.id, 'Has indicado un ID de ciudad que no se corresponde con ninguna ciudad de la base de datos. Es posible que te hayas equivocado al introducir el número de ID.');
                // TODO: ya hemos comprobado que el ID de ciudad existe, así que
                /* ahora queda cargar el modelo de suscripción y crear una nueva
                * suscripción con los datos del tipo y la ciudad suscrita.
                * creo que lo suyo es modificar el esquema de suscripciones para que
                * el documento indique id de ciudad, y para esa ciudad un array
                * con los datos de todos los suscriptores de dicha ciudad.
                */
            });
            return;
        }

        // Else, user is writing a city name:
        let re = new RegExp('^' + city + '.*', 'gi');
        console.log(re);
        City.find({
            name: re
        }).
        limit(7).
        select({ _id: 1, name: 1, country: 1}).
        exec( (err, cityArr) => {
            if (err) return bot.sendMessage(msg.chat.id, 'Uy... Parece que ha habido algún error al intentar suscribirte :( Habla con @adriangm si el problema persiste.');
            console.log(cityArr);
            if (city.length < 1) return bot.sendMessage(msg.chat.id, 'Las alertas en esa ciudad no están disponibles, sorry :/');
            bot.sendMessage(
                msg.chat.id,
                'Escribe <i>/subscribe</i> seguido de un espacio y el número identificador de la ciudad a la que quieres suscribirte para confirmar la suscripción. Puedes escribir varias a la vez separadas por comas.',
                { parse }
            ).then( () => {
                for (let item of cityArr) {
                    bot.sendMessage(msg.chat.id, item._id + ' - ' + item.name + ', ' + item.country);
                }
            });
        });
    }

});

bot.on('text', msg => {
    let id = msg.from.id;
    let text = msg.text;
    return bot.sendMessage(id, 'You said: ' + text);
});

bot.on('connect', () => {
    console.log('Bot is connected and runing...');
});

bot.on('disconnect', () => {
    console.log('Bot has been disconnected.');
});

bot.on('update', () => {
    console.log('Bot has asked for updates.');
});

// Export:
module.exports = bot;
