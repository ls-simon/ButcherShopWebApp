var XLS = require('xlsjs');
var wb = XLS.readFile('prisliste.xls');
var data = XLS.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

//Settings hvilken ting der skal oprettes
var Database = "mongodb://slagter:1234567@ds127801.mlab.com:27801/slagter"
var kategorier;
var currentKategori;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function contains(a, item) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === item) {
            return true;
        }
    }
    return false;
}

function find(a, item) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].navn === item) {
            return a[i]._id;
        }
    }
    return 0;
}

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
    VareKategori.find({}).exec(function (err, dataen) {
        if(err){
            console.log(err)
        }else{
        for (var i = 0; i < data.length; i++) {
            var produkt = data[i]['Produkt'];
            var pris = data[i]['Pris'];
            var enhed = data[i]['Enhed'] == undefined ? 'stk' : data[i]['Enhed'].toLowerCase();

            if (data[i]['Pris'] == "kategori") {
                currentKategori = capitalizeFirstLetter(produkt.toLowerCase());
            }

            if (produkt != undefined && pris != "kategori" && pris != undefined) {
                            var vare = new Vare({
                                navn: capitalizeFirstLetter(produkt.toLowerCase()),
                                enhed: enhed,
                                pris: pris,
                                beskrivelse: '',
                                varekategori: find(dataen, currentKategori)
                            });
                            vare.save(function (err) {
                                if (err) console.log("err");
                            });

            }
        }
        }});
});

//Models
var Vare = require('./../models/vare');
var VareKategori = require('./../models/varekategori');