//Models
var Vare = require('./../models/vare');
var VareKategori = require('./../models/varekategori');


//Settings hvilken ting der skal oprettes
var Database = "mongodb://slagter:1234567@ds127801.mlab.com:27801/slagter"

//Mongoose
var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Use new EcmaScript 6 promises
var mongoConn = mongoose.connect(Database).connection;
mongoConn.on('error', function(err) {
    console.error(err.message);
    console.error("MongoDB connection failed");
});
mongoConn.once('open', function() {
    console.log("MongoDB connection open");
});

Vare.find({}).populate('varekategori').exec(function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});
