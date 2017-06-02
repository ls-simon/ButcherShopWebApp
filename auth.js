var express = require('express');
var session = require('express-session');

module.exports = function (req, res, next) {

    if(req.session.bruger == undefined || req.session.bruger == null){
        res.redirect('/login');
    }
    next();
}


