var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var varekategori = new Schema({
    navn: String
}, { collection: 'VareKategori' });

module.exports = mongoose.model('VareKategori', varekategori);
