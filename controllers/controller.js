var Vare = require('../models/vare');
var VareKategori = require('../models/varekategori');
var Medarbejder = require('../models/medarbejder');
var Bestilling = require('../models/bestilling');
var BestillingsLinje = require('../models/bestillingsLinje');
var Login = require('../models/login');
var ObjectId = require('mongoose').Types.ObjectId;


// BESTILLING
// =============================================================================
exports.getBestillinger = function () {
    return new Promise(function (resolve, reject) {
        Bestilling.find({}).sort({afhentningsDato: 1}).populate('medarbejder').populate({path : 'bestillingLinjer', populate : {path : 'vare'}}).exec(
            function (err, data) {
                if (err) reject(err);
                else resolve(data);
            }
        );
    });
};


exports.getBestillingerByDate = function (dato) {
    return new Promise(function (resolve, reject) {
        var splitDato = dato.split("-");
        console.log(splitDato);
        var start = new Date(splitDato[0]+'-'+splitDato[1]+'-'+splitDato[2]+'T00:00:00.000Z');
        var end = new Date(splitDato[0]+'-'+splitDato[1]+'-'+splitDato[2]+'T23:59:59.000Z');
        Bestilling.find({"afhentningsDato": {"$gte": start, "$lt": end}}).sort({afhentningsDato: 1}).populate('medarbejder').populate({path : 'bestillingLinjer', populate : {path : 'vare'}}).exec(
            function (err, data) {
                console.log(data);
                if (err) reject(err);
                else resolve(data);
            }
        )
    })
};


exports.getBestillingerByDateInterval = function (fra, til) {
    return new Promise(function (resolve, reject) {
        var splitDato = fra.split("-");
        var splitDatoTil = til.split("-");
        console.log(splitDato);
        var start = new Date(splitDato[0]+'-'+splitDato[1]+'-'+splitDato[2]+'T00:00:00.000Z');
        var end = new Date(splitDatoTil[0]+'-'+splitDatoTil[1]+'-'+splitDatoTil[2]+'T23:59:59.000Z');
        Bestilling.find({"afhentningsDato": {"$gte": start, "$lt": end}}).sort({afhentningsDato: 1}).populate('medarbejder').populate({path : 'bestillingLinjer', populate : {path : 'vare'}}).exec(
            function (err, data) {
                console.log(data);
                if (err) reject(err);
                else resolve(data);
            }
        )
    })
};


exports.getBestillingById = function (id) {
    return new Promise(function (resolve, reject) {
        Bestilling.find({_id : id}).populate('medarbejder').populate({path : 'bestillingLinjer', populate : {path : 'vare'}}).exec(
            function (err, data) {
                if (err) reject(err);
                else resolve(data);
            }
        )
    })
};

exports.createBestilling = function (bestillingsDato, kundenavn, kundeTlf, kundeAdresse, afhentningsDato, status, kommentar, emballage, medarbejder, bestillingsLinjer) {
    return new Promise(function (resolve, reject) {
        var bestilling = new Bestilling({bestillingsDato: bestillingsDato,
            kundeNavn: kundenavn,
            kundeTlf: kundeTlf,
            kundeAdresse: kundeAdresse,
            afhentningsDato: afhentningsDato,
            status: status,
            kommentar: kommentar,
            emballage: emballage,
            medarbejder: medarbejder,
            bestillingLinjer: bestillingsLinjer
        });
        bestilling.save(function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
};

exports.updateBestilling = function (id, data) {
    return new Promise(function (resolve, reject) {
        Bestilling.findByIdAndUpdate(id, data, {new: true}, function(err,val) {
            if(err) reject(err);
            else resolve(val);
        });
    });
};


exports.removeBestillingsLinjeFraBestilling = function (id, bestillingLinjeId) {
    return new Promise(function (resolve, reject) {
        Bestilling.findById({_id: id}, function(err, bestilling) {

            if(err) reject(err);

            var index = bestilling.bestillingLinjer.indexOf(bestillingLinjeId);
            bestilling.bestillingLinjer.splice(index, 1);

            bestilling.save(function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

exports.removeBestilling = function (id) {
    return new Promise(function (resolve, reject) {
        Bestilling.find({_id: id}).remove().exec(function(err) {
                if (err) reject(err);
                else resolve();
        });
    });
};

// BESTILLINGSLINJE
// =============================================================================
exports.createBestillingsLinje = function (pris, antal, vare, kommentar, bestillingsvare, pakket, bestilt) {
    return new Promise(function (resolve, reject) {
        var bestillingsLinje = new BestillingsLinje({
            pris: pris,
            antal: antal,
            vare: vare,
            kommentar: kommentar,
            bestillingsvare: bestillingsvare,
            pakket: pakket,
            bestilt: bestilt
        });
        bestillingsLinje.save(function (err, data) {
            if (err) reject(err);
            else resolve(bestillingsLinje._id);
        });
    });
};

exports.getBestillingsLinjeById = function (id) {
    return new Promise(function (resolve, reject) {
        BestillingsLinje.find({_id : id}).populate('vare').exec(
            function (err, data) {
                if (err) reject(err);
                else resolve(data);
            }
        )
    })
};

exports.removeBestillingsLinjeById = function (id) {
    return new Promise(function (resolve, reject) {
        BestillingsLinje.find({_id : id}).remove().exec(
            function (err) {
                if (err) reject(err);
                else resolve();
            }
        )
    })
};


exports.updateBestillingsLinje = function (id, data) {
    return new Promise(function (resolve, reject) {
        BestillingsLinje.findByIdAndUpdate(id, data, {new: true}, function(err,val) {
            if(err) reject(err);
            else resolve(val);
        });
    });
};

// MEDARBEJDER
// =============================================================================
exports.getMedarbejderById = function (id) {
    return new Promise(function (resolve, reject) {
        Medarbejder.find({_id: id}).exec(
            function (err, data) {
                if (err) reject(err);
                else resolve(data);
            }
        )
    })
};
exports.getMedarbejder = function () {
    return new Promise(function (resolve, reject) {
        Medarbejder.find({}).exec(
            function (err, data) {
                if (err) reject(err);
                else resolve(data);
            }
        );
    });
};

exports.createMedarbejder = function (navn, nr) {
    return new Promise(function (resolve, reject) {
        var medarbejder = new Medarbejder({navn: navn, nr: nr});
        medarbejder.save(function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
};


exports.updateMedarbejder = function (id, data) {
    return new Promise(function (resolve, reject) {
        Medarbejder.findByIdAndUpdate(id, data, {new: true}, function(err,val) {
            if(err) reject(err);
            else resolve(val);
        });
    });
};

exports.removeMedarbejder = function (id) {
    return new Promise(function (resolve, reject) {
        Medarbejder.find({_id: id}).remove().exec(function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
};

// VAREKATEGORI
// =============================================================================
exports.getVareKategorier = function() {
    return new Promise(function(resolve, reject) {
        VareKategori.find({}).exec(
            function (err, data) {
                if (err) reject(err);
                else resolve(data);
            }
        );
    });
};

exports.createVareKategori = function (navn) {
    return new Promise(function (resolve, reject) {
        var varekategori = new VareKategori({navn: navn});
        varekategori.save(function (err) {
            if (err) reject(err)
            else resolve()
        });
    });
};

exports.removeVareKategori = function (id) {
    return new Promise(function (resolve, reject) {

        Vare.find({varekategori:id}).count(function(err, count){
            if(err){
                reject(err);
            }

            if(count == 0){
                VareKategori.find({_id: id}).remove().exec(function(err) {
                    if (err) reject(err);
                    else resolve();
                });
            }else{
                reject("Kunne ikke slette kategorien da den indeholder vare")
            }

        });
    });
};


exports.updateVareKategori = function (id, data) {
    return new Promise(function (resolve, reject) {
        VareKategori.findByIdAndUpdate(id, data, {new: true}, function(err,val) {
            if(err) reject(err);
            else resolve(val);
        });
    });
};

// VARE
// =============================================================================
exports.getVare = function() {
    return new Promise(function(resolve, reject) {
        Vare.find({}).populate('varekategori').exec(
            function (err, data) {
                if (err) reject(err);
                else resolve(data);
            }
        );
    });
};

exports.getVareById = function(id) {
    return new Promise(function(resolve, reject) {
        Vare.find({_id:id}).exec(
            function (err, data) {
                if (err) reject(err);
                else resolve(data);
            }
        );
    });
};


exports.getVareByKategoriId = function(id) {
    return new Promise(function(resolve, reject) {
        Vare.find({varekategori:id}).exec(
            function (err, data) {
                if (err) reject(err);
                else resolve(data);
            }
        );
    });
};

exports.createVare = function (navn, enhed, pris, beskrivelse, varekategori) {
    return new Promise(function (resolve, reject) {
        var vare = new Vare({navn: navn, enhed: enhed, pris: pris, beskrivelse: beskrivelse, varekategori: varekategori});
        vare.save(function (err) {
            if (err) reject(err)
            else resolve()
        });
    });
};

exports.updateVare = function (id, data) {
    return new Promise(function (resolve, reject) {
        Vare.findByIdAndUpdate(id, data, {new: true}, function(err,val) {
            if(err) reject(err);
            else resolve(val);
        });
    });
};

exports.removeVare = function (id) {
    return new Promise(function (resolve, reject) {
        Vare.find({_id: id}).remove().exec(function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
};


// LOG IND
// =============================================================================


exports.logIn = function(brugernavn, adgangskode) {
    return new Promise(function(resolve, reject) {
        Login.find({brugernavn:brugernavn, adgangskode:adgangskode}).exec(
            function (err, data) {
                if (err) reject(err);
                else resolve(data);
            }
        );
    });
};

