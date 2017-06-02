var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller');

router.route('/')
    .get(function (req, res) {
        res.send("For at se en bestemt bestillingslinje gå til bestillingsLinje/id")
});

router.route('/:id')
    .get(function (req, res) {
        controller.getBestillingsLinjeById(req.params.id)
            .then(function (val) {
                res.json(val);
            })
            .catch(function (err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            });
    }).put(function(req, res){
    controller.updateBestillingsLinje(req.params.id, req.body)
        .then(function () {
            res.send("Linjen blev opdateret");
        })
        .catch(function (err) {
            console.error("Error: " + err);
            if (err.stack) console.error(err.stack);
            res.status(500).send(err);
        });
}).delete(function(req, res){
    controller.removeBestillingsLinjeFraBestilling(req.body.id, req.params.id)
        .then(function () {
            controller.removeBestillingsLinjeById(req.params.id).then(function(){
                res.send("BestillingsLinje slettet");
            }).catch(function (err) {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                res.status(500).send(err);
            })
        })
        .catch(function (err) {
            console.error("Error: " + err);
            if (err.stack) console.error(err.stack);
            res.status(500).send(err);
        });
});

router.route('/opret/:id')
    .post(function(req, res){
    controller.createBestillingsLinje(req.body.pris, req.body.antal, req.body.vare.id,  req.body.kommentar, req.body.bestillingsvare, req.body.pakket, req.body.bestilt)
        .then(function(bestillingsLinjeId){
            controller.getBestillingById(req.params.id)
                .then(function(bestillingsId){

                var linjer = [];
                for(var i = 0; i<bestillingsId[0].bestillingLinjer.length; i++){
                    linjer.push(bestillingsId[0].bestillingLinjer[i]._id);
                }
                    linjer.push(bestillingsLinjeId);

                    controller.updateBestilling(req.params.id, {bestillingLinjer:linjer})
                        .then(function(){
                            res.send("Bestillings linje oprettet")
                        })
                        .catch(function (err) {
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
        .catch(function (err) {
        console.error("Error: " + err);
        if (err.stack) console.error(err.stack);
        res.status(500).send(err);
    });


});
    });
module.exports = router;