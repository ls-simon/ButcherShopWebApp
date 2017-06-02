var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var medarbejder = new Schema({
    navn: String,
    nr: Number
}, { collection: 'Medarbejder' });

module.exports = mongoose.model('Medarbejder', medarbejder);
