'use strict';
// Schema for subscriptions:
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    chatId: Number,
    chatType: String,
    chatTitle: String,
    username: String,
    firstName: String,
    lastName: String,
    locations: [{
        id: Number,
        name: String
    }],
    updated: { type: Date, default: Date.now }
});

// Model using the schema:
var Subscription = mongoose.model('Subscription', subscriptionSchema);

// Exports:
module.exports = Subscription;
