var express = require('express');
var path = require('path');
var router = express.Router();
var controller = require('../controllers/controller');

router.route('/')
    .get(function (req, res) {
        controller.getBestillinger()
            .then(function(val) {
                res.json(val);
            })
            .catch(function(err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    }).post(function (req, res) {
        var bestillingsLinjer = req.body.bestillingslinjer;
        if(bestillingsLinjer != undefined && bestillingsLinjer.length != 0){
            var waitBestillingsLinjer = [];

            for(var i = 0; i < bestillingsLinjer.length; i++){
                waitBestillingsLinjer.push(controller.createBestillingsLinje(bestillingsLinjer[i].pris, bestillingsLinjer[i].antal, bestillingsLinjer[i].vare.id, bestillingsLinjer[i].kommentar, bestillingsLinjer[i].bestillingsvare, bestillingsLinjer[i].pakket, bestillingsLinjer[i].bestilt));
            }
            Promise.all(waitBestillingsLinjer).then(function(data){
                controller.createBestilling(req.body.bestillingsDato, req.body.kundeNavn, req.body.kundeTlf, req.body.kundeAdresse, req.body.afhentningsDato, req.body.status, req.body.kommentar, req.body.emballage, req.body.medarbejder, data)
                    .then(function () {res.send("Oprettet");}).catch(function (err) {
                    console.error("Error: " + err);
                    if (err.stack) console.error(err.stack);
                    res.status(500).send(err);
                });
            }).catch(function (err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });

        }
});

router.route('/:id')
    .get(function (req, res) {
        controller.getBestillingById(req.params.id)
            .then(function (val) {
                res.json(val);
            })
            .catch(function (err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    }).put(function(req, res){
        console.log(req.body);
    controller.updateBestilling(req.params.id, req.body)
        .then(function (data) {
        res.send(data);
    }).catch(function (err) {
        console.error("Error: " + err);
        if (err.stack) console.error(err.stack);
    });
}).delete(function (req, res) {
    controller.getBestillingById(req.params.id)
        .then(function(data){
            console.log(data[0].bestillingLinjer);
            var linjePromises = [];

            for(var i = 0; i < data[0].bestillingLinjer.length; i++){
                linjePromises.push(controller.removeBestillingsLinjeById(data[0].bestillingLinjer[i]._id));
            }
            Promise.all(linjePromises).then(function(){
                controller.removeBestilling(req.params.id).then(function(data){
                    res.send("Bestilling slettet");
                }).catch(function(err){
                    console.error("Error: " + err);
                    if (err.stack) console.error(err.stack);
                    res.status(500).send(err);
                })
            }).catch(function(err){
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            })
        })
        .catch(function (err) {
        console.error("Error: " + err);
        if (err.stack) console.error(err.stack);
            res.status(500).send(err);
    })
});

router.route('/dato/:dato')
    .get(function (req, res) {
        controller.getBestillingerByDate(req.params.dato)
            .then(function (val) {
                res.send(val);
            })
            .catch(function (err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    });

router.route('/dato/:fra/:til')
    .get(function (req, res) {
        controller.getBestillingerByDateInterval(req.params.fra, req.params.til)
            .then(function (val) {
                res.json(val);
            })
            .catch(function (err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    });


router.route('/lager/:type/:dato')
    .get(function (req, res) {
        controller.getBestillingByTypeAndDate(req.params.type, req.params.dato)
            .then(function (val) {
                res.json(val);
            })
            .catch(function (err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    });


router.route('/:type/:fra/:til')
    .get(function (req, res) {
        controller.getBestillingByTypeAndDateInterval(req.params.type, req.body.fra, req.body.til)
            .then(function (val) {
                res.json(val);
            })
            .catch(function (err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    });





module.exports = router;