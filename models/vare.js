var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var vare = new Schema({
    navn: String,
    enhed: String,
    pris: Number,
    beskrivelse: String,
    varekategori: {type: Schema.Types.ObjectId, ref: 'VareKategori'}
}, { collection: 'Vare' });

module.exports = mongoose.model('Vare', vare);
