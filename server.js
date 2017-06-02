"use strict";

// INITIALIZATION
// =============================================================================
var config = require('./config');
var express = require('express');        // call express
var app = express();                     // define our app using express
var bodyParser = require('body-parser'); // parses JSON and url-encoded forms on requests
var morgan = require('morgan');          // logs all incoming requests to std.out
var path = require('path');

var session = require('express-session');          // logs all incoming requests to std.out
var cookieParser = require('cookie-parser');

app.set('port', (process.env.PORT || config.defaultPort)); // Set the port

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(session({
    secret: 'slagterbiks',
    resave: false,
    saveUninitialized: true
}));



// MONGODB & MONGOOSE SETUP
// =============================================================================

var mongoose = require('mongoose').set('debug', true);
mongoose.Promise = global.Promise; // Use new EcmaScript 6 promises
var mongoConn = mongoose.connect(config.mongoDatabase).connection;
mongoConn.on('error', function(err) {
    console.error(err.message);
    console.error("MongoDB connection failed");
});
mongoConn.once('open', function() {
    console.log("MongoDB connection open");
});

// ROUTES FOR THE APP
// =============================================================================
app.use('/login', express.static(__dirname + '/public/login'));

var login = require('./routes/login');
app.use('/login', login);

var auth = require('./auth');
app.use(auth);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/views'));
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/img'));
app.use(express.static(__dirname + '/public/fonts'));
app.use(express.static(__dirname + '/public/views/ny-bestilling'));
app.use(express.static(__dirname + '/public/views/bestillingsoversigt'));
app.use(express.static(__dirname + '/public/views/administration'));

var navigation = require('./routes/navigation');
app.use('/navigation', navigation);

var vare = require('./routes/vare');
app.use('/vare', vare);

var varekategori = require('./routes/varekategori');
app.use('/varekategori', varekategori);

var medarbejder = require('./routes/medarbejder');
app.use('/medarbejder', medarbejder);

var bestilling = require('./routes/bestilling');
app.use('/bestilling', bestilling);

var bestillingsLinje = require('./routes/bestillingslinje');
app.use('/bestillingsLinje', bestillingsLinje);


// START THE SERVER
// =============================================================================
app.listen(app.get('port'), function () {
    console.log('App is running on port', app.get('port'));
});

module.exports = app;
