var express = require('express');
var path = require('path');
var router = express.Router();
var rights = require('../rights');

router.route('/')
    .get(function (req, res) {

        if(rights.isAdmin(req)){
            res.sendFile('admin.html', { root: path.join(__dirname, '../public/navigation') });
        }else{
            res.sendFile('user.html', { root: path.join(__dirname, '../public/navigation') });
        }
    })

module.exports = router;