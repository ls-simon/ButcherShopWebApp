var express = require('express');
var session = require('express-session');

exports.isAdmin = function(req){

    if(req.session.bruger == undefined || req.session.bruger.admin == null || req.session.bruger.admin == false){
        return false;
    }
    return true;
}