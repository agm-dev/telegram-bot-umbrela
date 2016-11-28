'use strict';
// Schema for subscriptions:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subscriptorSchema = require('./subscriptor.js');

const subscriptionSchema = new Schema({
    _id: Number,
    name: String,
    country: String,
    rain: { type: Boolean, default: false },
    subscribers: [ subscriptorSchema ],
    updated: { type: Date, default: Date.now }
});

// Model using the schema:
var Subscription = mongoose.model('Subscription', subscriptionSchema);

// Exports:
module.exports = Subscription;
