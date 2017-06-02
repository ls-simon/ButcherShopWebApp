var express = require('express');
var path = require('path');
var router = express.Router();
var md5 = require('md5');
var controller = require('../controllers/controller');

router.route('/')
    .get(
        function(req, res) {
            console.log(req.session.bruger);
            res.sendFile('login.html', { root: path.join(__dirname, '../public/login') });
        }).post(function (req, res) {
            controller.logIn(req.body.brugernavn, md5(req.body.adgangskode)).then(function (data) {
                if(data[0] != undefined) {
                    var obj = {brugernavn: data[0].brugernavn, admin: data[0].admin};
                    req.session.bruger = obj;
                    res.send({ redirect: '/' })
                } else{
                    res.status(500).send("Ingen bruger fundet på givet brugernavn eller adgangskode");
                }
            }).catch(function (err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });

});

router.route('/logout').get(function (req, res) {
    req.session.destroy(function (err) {
        if(err) console.log(err);
        else res.redirect('/login');
    });
});

module.exports = router;