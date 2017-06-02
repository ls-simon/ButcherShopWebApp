var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var login = new Schema({
    brugernavn: String,
    adgangskode: String,
    admin: Boolean
}, { collection: 'Login' });

module.exports = mongoose.model('Login', login);
