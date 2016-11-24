'use strict';
// Requires:
var mongoose = require('mongoose');

// Connection string:
var database = 'mongodb://localhost/umbrela';

// Create database connection:
mongoose.connect(database);

// Connection events and functions:
function shutdownApp() {
    // Terminates connection as database is required to correct usage.
    console.log('Terminating app execution...');
    process.exit(0);
}

mongoose.connection.on('connected', function (){
    console.log('Mongoose open connection to '+ database);
});

mongoose.connection.on('error', function (err){
    console.log('Mongoose connection error: '+ err);
    shutdownApp();
});

mongoose.connection.on('disconnected', function (){
    console.log('Mongoose connection disconnected');
    shutdownApp();
});

// If node ends:
process.on('SIGINT', function (){
    mongoose.connection.close(function (){
        console.log('Mongoose connection disconnected through app termination');
        process.exit(0);
    });
});
