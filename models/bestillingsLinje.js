var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var bestillingsLinje = new Schema({
    pris: Number,
    antal: Number,
    vare: {type: Schema.Types.ObjectId, ref: 'Vare'},
    kommentar: String,
    bestillingsvare: Boolean,
    pakket: Boolean,
    bestilt: Boolean
}, { collection: 'BestillingsLinje' });

module.exports = mongoose.model('BestillingsLinje', bestillingsLinje);
