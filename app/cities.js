'use strict';
// Schema for cities:
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const citiesSchema = new Schema({
    _id: Number,
    name: String,
    country: String,
    coord: {
        lon: Number,
        lat: Number
    }
});

// Model using the schema:
var City = mongoose.model('City', citiesSchema);

// Exports:
module.exports = City;
