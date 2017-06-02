var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var bestilling = new Schema({
   bestillingsDato: Date,
    kundeNavn: String,
    kundeTlf: String,
    kundeAdresse: String,
    afhentningsDato: Date,
    status: String,
    kommentar: String,
    emballage: String,
    medarbejder: {type: Schema.Types.ObjectId, ref: 'Medarbejder'},
    bestillingLinjer: [{type: Schema.Types.ObjectId, ref: 'BestillingsLinje'}]
}, { collection: 'Bestilling' });

module.exports = mongoose.model('Bestilling', bestilling, 'Bestilling');
