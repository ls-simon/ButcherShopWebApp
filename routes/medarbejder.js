var controller = require("../controllers/controller");
var express = require('express');
var router = express.Router();

router.route('/')
    .get(function (req, res) {
        controller.getMedarbejder()
            .then(function(val) {
                res.json(val);
            })
            .catch(function(err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    }).post(function (req, res) {
    controller.createMedarbejder(req.body.navn, req.body.nr).then(function () {
        res.send("Medarbejder gemt!");
    }).catch(function(err) {
        console.error("Error: " + err);
        if (err.stack) console.error(err.stack);
        res.status(500).send(err);
    });
});

router.route('/:id')
    .get(function (req, res) {
        controller.getMedarbejderById(req.params.id)
            .then(function (val) {
                res.json(val);
            })
            .catch(function (err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    }).put(function (req, res) {
    controller.updateMedarbejder(req.params.id, req.body)
        .then(function (val) {
            res.json(val);
        })
        .catch(function (err) {
            console.error("Error: " + err);
            if (err.stack) console.error(err.stack);
            res.status(500).send(err);
        });
}).delete(function (req, res) {
    controller.removeMedarbejder(req.params.id)
        .then(function () {
            res.send("Slettet");
        })
        .catch(function (err) {
            console.error("Error: " + err);
            if (err.stack) console.error(err.stack);
            res.status(500).send(err);
        });
});

    module.exports = router;