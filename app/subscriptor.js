'use strict';
// Schema for subscriptor:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptorSchema = new Schema({
    _id: Number,
    chatType: String,
    username: String,
    firstName: String,
    lastName: String,
    date: { type: Date, default: Date.now }
});

// Exports:
module.exports = subscriptorSchema;
