var controller = require("../controllers/controller");
var express = require('express');
var router = express.Router();

router.route('/')
    .get(function (req, res) {
        controller.getVareKategorier()
            .then(function(val) {
                res.json(val);
            })
            .catch(function(err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    }).post(function (req, res) {
    controller.createVareKategori(req.body.navn)
        .then(function (val) {
            res.send("Varekategori oprettet!");
        }).catch(function (err) {
        console.error("Error: " + err);
        if (err.stack) console.error(err.stack);
        res.status(500).send(err);
    })
})

router.route('/:id')
    .get(function(req, res) {
        controller.getVareByKategoriId(req.params.id)
            .then(function(val) {
                res.json(val);
            })
            .catch(function(err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    }).put(function (req, res) {
    controller.updateVareKategori(req.params.id, req.body)
        .then(function(val) {
            res.json(val);
        })
        .catch(function(err) {
            console.error("Error: " + err);
            if (err.stack) console.error(err.stack);
            res.status(500).send(err);
        })
}).delete(function (req, res) {
    controller.removeVareKategori(req.params.id)
        .then(function(val) {
            res.send("Slettet");
        })
        .catch(function(err) {
            console.error("Error: " + err);
            if (err.stack) console.error(err.stack);
            res.status(500).send(err);
        });
});

module.exports = router;