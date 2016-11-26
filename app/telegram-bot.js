'use strict';
//// Telegram bot ////

// Requires:
const Telebot = require('telebot');
const apiKey = require('./keys/umbrela-telegram-key.js');
const mongoose = require('mongoose');
const City = require('./cities.js');
const Subscription = require('./subscriptions.js');

const bot = new Telebot({
    token: apiKey,
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

    // Send instructions to confirm subscription:
    if (cities.length > 0 && Number.isNaN( parseInt( cities[0] )) ) {
        bot.sendMessage(
            msg.chat.id,
            'Escribe <i>/subscribe</i> seguido de un espacio y el número identificador de la ciudad a la que quieres suscribirte para confirmar la suscripción. Puedes escribir varias a la vez separadas por comas.',
            { parse }
        );
    }

    for (let city of cities) {
        // Look for them on cities collection:
        city = city.trim();
        if (city.length <= 0) continue;
        console.log(city);

        // /SUBSCRIBE ID
        // If user writes a city ID:
        if (!Number.isNaN( parseInt( city ) )) {
            City.findOne({
                _id: city
            }).
            select({ _id: 1, name: 1, country: 1}).
            exec( (err, city) => {
                console.log(city);
                if (err) return bot.sendMessage(msg.chat.id, 'Uy... Parece que ha habido algún error al intentar suscribirte :( Habla con @adriangm si el problema persiste.');
                if (!city) return bot.sendMessage(msg.chat.id, 'Has indicado un ID de ciudad que no se corresponde con ninguna ciudad de la base de datos. Es posible que te hayas equivocado al introducir el número de ID.');
                Subscription.findOne({
                    _id: city._id
                }).
                select({ _id: 1, name: 1, country: 1}).
                exec( (err, cityData) => {
                    if (err) return false;
                    if (!cityData) {
                        // Then add new whole subscription:
                        let subscriptionData = {
                            _id: city._id,
                            name: city.name,
                            country: city.country,
                            subscribers: [{
                                _id: msg.chat.id,
                                chatType: msg.chat.type,
                                username: msg.chat.username,
                                firstName: msg.chat.first_name,
                                lastName: msg.chat.last_name,
                            }],
                        };
                        console.log(subscriptionData);
                        let subscription = new Subscription(subscriptionData);
                        subscription.save( (err) => {
                            if (err) return console.log('Cannot save subscription into database');
                            console.log('New subscription was added to database');
                            return bot.sendMessage(msg.chat.id, 'Te has suscrito con éxito a las alertas de ' + city.name + ', ' + city.country);
                        });
                    } else {
                        // Then find id subscriptor into nested array:
                        Subscription.findOne({
                            _id: city._id,
                            'subscribers._id': msg.chat.id
                        }).exec( (err, subscriberData) => {
                            if (err) return false;
                            if (subscriberData) {
                                // If there is data, then subscription already exists:
                                console.log('That subscription already exists');
                                return bot.sendMessage(msg.chat.id, 'Ya hemos registrado una suscripción para las alertas de '+ cityData.name + ', ' + cityData.country);
                            } else {
                                // If there is no data, then push data to subscribers array:
                                console.log('City document exists, but this person is not a suscriber. Updating document...');
                                let subscriber = {
                                    _id: msg.chat.id,
                                    chatType: msg.chat.type,
                                    username: msg.chat.username,
                                    firstName: msg.chat.first_name,
                                    lastName: msg.chat.last_name,
                                };
                                Subscription.update(
                                    { _id: city._id },
                                    { $push: { subscribers: subscriber } }
                                ).exec( (err) => {
                                    if (err) return console.log('Cannot update the array of subscribers');
                                    console.log('Document updated. New subscriber was added');
                                    return bot.sendMessage(msg.chat.id, 'Te has suscrito con éxito a las alertas de ' + city.name + ', ' + city.country);
                                });
                            }
                        });
                    }
                });
            });
        }

        // /SUBSCRIBE NAME
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
            for (let item of cityArr) {
                bot.sendMessage(msg.chat.id, item._id + ' - ' + item.name + ', ' + item.country);
            }
        });
    }

});

bot.on('/unsubscribe', msg => {

    let parse = 'html';
    if (msg.text === '/unsubscribe') return bot.sendMessage(msg.chat.id, 'Puedo eliminar todas tus suscripciones de alertas de tiempo si me escribes el mensaje <i>/unsubscribe all</i>', { parse });

    if (msg.text === '/unsubscribe all') {
        // Is there subscriptions?
        Subscription.find({ 'subscribers._id': msg.chat.id }).exec( (err, results) => {
            if (err) return console.log('Cannot perform a find query on database');
            if (results.length <= 0) return bot.sendMessage(msg.chat.id, 'No tienes ninguna suscripción');

            // We find all that guy subscriptions and remove them:
            // db.subscriptions.update({},{$pull: {subscribers: { _id: msg.chat.id } } },{multi:true});
            Subscription.update(
                {},
                { '$pull': { subscribers: { _id: msg.chat.id } } },
                { multi: true },
                (err) => {
                    if (err) return bot.sendMessage(msg.chat.id, 'Mmm, no me ha sido posible eliminar tus suscripciones ahora mismo :/ Vuelve a intentarlo más tarde o ponte en contacto con @adriangm');
                    console.log('Subscriptions of chat ' + msg.chat.id + ' has been removed');
                    return bot.sendMessage(msg.chat.id, 'Todas tus suscripciones han sido eliminadas. No te molestaré con más mensajes :3');
                }
            );
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
