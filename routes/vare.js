var controller = require("../controllers/controller");
var express = require('express');
var router = express.Router();

router.route('/')
    .get(function (req, res) {
        controller.getVare()
            .then(function(val) {
                res.json(val);
            })
            .catch(function(err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    }).post(function (req, res) {
    controller.createVare(req.body.navn, req.body.enhed, req.body.pris, req.body.beskrivelse, req.body.varekategori).then(function () {
        res.send("Vare oprettet!")
    }).catch(function (err) {
        console.error("Error: " + err);
        if (err.stack) console.error(err.stack);
        res.status(500).send(err);
    })
})

router.route('/:id')
            .get(function (req, res) {
                controller.getVareById(req.params.id)
                    .then(function(val) {
                        res.json(val);
                    })
                    .catch(function(err) {
                        console.error("Error: " + err);
                        if (err.stack) console.error(err.stack);
                        res.status(500).send(err);
                    });
    }).put(function (req, res) {
    controller.updateVare(req.params.id, req.body)
        .then(function(val) {
            res.json(val);
        })
        .catch(function(err) {
            console.error("Error: " + err);
            if (err.stack) console.error(err.stack);
            res.status(500).send(err);
        });
}).delete(function (req, res) {
    controller.removeVare(req.params.id)
        .then(function(val) {
            res.send("Slettet");
        })
        .catch(function(err) {
            console.error("Error: " + err);
            if (err.stack) console.error(err.stack);
            res.status(500).send(err);
        });
})

module.exports = router;