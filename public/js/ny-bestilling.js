function loadKategorier() {

    $.getJSON('/varekategori', function (data) {
        $.get('valg_kategori_dropdown.hbs', function (template) {
            var compiled = Handlebars.compile(template);
            var obj = {kategori: data};
            var html = compiled(obj);
            $('#kategoriDropdown').html(html);
            $('.selectpicker').selectpicker();
            visVarer($('#valg_kategori_dropdown').find(':selected').attr('data-id'));
        });
    }).fail(function () {
        errorAlert('#ny-bestilling', 'Kategorierne kunne ikke hentes. Prøv igen');
    });
}

function registerHelpers() {
    Handlebars.registerHelper('prisTotal', function (n1, n2) {
        return (n1 * n2).toFixed(2);
    });
}

function visVarer(id) {
    if (id != undefined) {
        $('#vare_oversigt').empty();
        $.getJSON('/varekategori/' + id, function (data) {
            $.get('vare_oversigt.hbs', function (template) {
                var compiled = Handlebars.compile(template);
                var obj = {vare: data};
                var html = compiled(obj);
                $('#vare_oversigt').html(html);
            });
        }).fail(function () {
            errorAlert('#ny-bestilling', 'Varerne kunne ikke hentes. Prøv igen');
        });
    } else {
        errorAlert('#ny-bestilling', 'Varerne kunne ikke hentes. Prøv igen');
    }
}

var fuse;

/**
 * Henter alle varer til fuseBestilling.js søgefelt
 */
function hentAlleVarer() {
    $.getJSON('/vare', function (data) {
        fuse = new Fuse(data, options);
    }).fail(function () {
        errorAlert('#ny-bestilling', 'Varerne kunne ikke hentes. Prøv igen');
    });
}

function loadMedarbejdere() {
    $.getJSON('/medarbejder', function (data) {
        $.get('valg_medarbejder_dropdown.hbs', function (template) {
            var compiled = Handlebars.compile(template);
            var obj = {medarbejder: data};
            var html = compiled(obj);
            $('#medarbejder_ID').html(html);
            $('.selectpicker').selectpicker();

            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
                $('.selectpicker').selectpicker('mobile');
            }
        });
    }).fail(function () {
        errorAlert('#ny-bestilling', 'Medarbejdere kunne ikke hentes. Prøv igen');
    });
}

//fuseBestilling.js search option
var options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        'navn'
    ]
};

var updateBestillingsliste = function () {
    $.get('bestillings_liste.hbs', function (template) {
        var compiled = Handlebars.compile(template);
        var obj = {bestillingslinje: bestillingslinjer};
        var html = compiled(obj);
        $('#bestillings_liste').html(html);
    });
};

function Bestillingslinje(pris, antal, vare, kommentar, bestillingsvare) {
    this.pris = pris;
    this.antal = antal;
    this.vare = vare;
    this.kommentar = kommentar;
    this.bestillingsvare = bestillingsvare;
    this.pakket = false;
    this.bestilt = false;
}

function Bestilling(bestillingslinjer, bestillingsDato, kundeNavn, kundeTlf, kundeAdresse, afhentningsDato, kommentar, emballage, medarbejder) {
    this.bestillingslinjer = bestillingslinjer;
    this.bestillingsDato = bestillingsDato;
    this.kundeNavn = kundeNavn;
    this.kundeTlf = kundeTlf;
    this.kundeAdresse = kundeAdresse;
    this.afhentningsDato = afhentningsDato;
    this.status = 'Bestilt';
    this.kommentar = kommentar;
    this.emballage = emballage;
    this.medarbejder = medarbejder;
}

function updateSamletPris() {
    var pris = 0;
    $.each(bestillingslinjer, function (i, item) {
        pris += parseFloat(item.pris * item.antal);
    });
    $('#samlet_pris').val(pris.toFixed(2));
}

function resetAllVare() {
    $($('#input-antal-vare')).val('');
    $('#bestillingsvare-checkbox').prop('checked', false);
    $('a.list-group-item.active').removeClass('active');
    $('#pris_vare').val(0);
    prisVareSamlet(0, 0);
    $('#kommentar-vare').val('');
}

function resetAllBestilling() {
    $('#kunde_navn').val('');
    $('#kunde_adresse').val('');
    $('#kunde_tlf').val(null);
    $('#kommentar-bestilling').val('');
    $('#vælg_bestillings_dato').val(moment().format('YYYY-MM-DDTHH:mm'));
    $('#valg_medarbejder_dropdown').selectpicker('refresh');
    $('#bestillings_liste').empty();
    $('#samlet_pris').val(0);
    $('#emballage-checkbox').prop('checked', false);
    bestillingslinjer = [];
}

function prisVareSamlet(stykpris, antal) {
    $('#pris_vare_samlet').empty();
    var html = '<p> I alt: ' + (stykpris * antal).toFixed(2) + ' kr.</p>';
    $('#pris_vare_samlet').prepend(html);
}

var bestillingslinjer = [];

//-------------event triggers-------------

$(document).on('change', '#valg_kategori_dropdown', function () {
    var id = $(this).find(':selected').attr('data-id');
    visVarer(id);
});

$(document).on('click', '#procent-rabat', function () {
    var tal = $('#rabat-vare').val();
    if (tal != null) {
        var procent = 1 - (tal/100);
        $('#pris_vare').val(($('#pris_vare').val() * procent).toFixed(2));
        prisVareSamlet($('#pris_vare').val(), parseFloat($('#input-antal-vare').val()));
    }
});

$(document).on('click', '#kr-rabat', function () {
    var kr = $('#rabat-vare').val();
    if (kr != null) {
        $('#pris_vare').val(($('#pris_vare').val() - kr).toFixed(2));
        prisVareSamlet($('#pris_vare').val(), parseFloat($('#input-antal-vare').val()));
    }
});

$(document).on('click', '#button_slet_vare_bestilling', function () {
    var vareid = $(this).closest('p').attr('data-id');
    $.each(bestillingslinjer, function (i, item) {
        if (item.vare.id == vareid) {
            bestillingslinjer.splice(i, 1);
            updateBestillingsliste();
            updateSamletPris();
        }
    });
});

$(document).on('keyup', '#søg_vare_felt', function () {
    var search = $(this).val();
    var result = fuse.search(search);
    $.get('vare_oversigt.hbs', function (template) {
        var compiled = Handlebars.compile(template);
        var obj = {vare: result};
        var html = compiled(obj);
        $('#vare_oversigt').html(html);
    });
});

$(document).on('click', '#vare_oversigt a', function () {
    $($('#input-antal-vare')).val(1);
    $('#rabat-vare').val(0);
    $('.list-group-item.active').removeClass('active');
    $(this).addClass('active');
    $('#pris_vare').val($(this).attr('data-field'));
    $('#pris-enhed-overskrift').text('Pris per ' + $(this).attr('data-enhed'));
    $('#antal-enhed-overskrift').text('Antal ' + $(this).attr('data-enhed'));
    prisVareSamlet(parseFloat($(this).attr('data-field')), 1);
});

$(document).on('click', '#btn-number-minus, #btn-number-plus', function (e) {
    e.preventDefault();
    var enhed = $('a.list-group-item.active').attr('data-enhed');
    var input = $('#input-antal-vare');
    var type = $(this).attr('data-type');

    var currentVal = parseFloat(input.val());
    if (currentVal != null) {
        if (type === 'minus') {
            $('#btn-number-plus').attr('disabled', false);
            if (currentVal > input.attr('min')) {
                if (enhed == 'kg') {
                    input.val((currentVal - 0.1).toFixed(1) + '');
                    prisVareSamlet($('#pris_vare').val(), parseFloat(input.val()));
                } else {
                    input.val(currentVal - 1 + '');
                    prisVareSamlet($('#pris_vare').val(), parseFloat(input.val()));
                }
            }
            if (parseFloat(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }
        } else if (type === 'plus') {
            $('#btn-number-minus').attr('disabled', false);
            if (currentVal < input.attr('max')) {
                if (enhed == 'kg') {
                    input.val((currentVal + 0.1).toFixed(1) + '');
                    prisVareSamlet($('#pris_vare').val(), parseFloat(input.val()));
                } else {
                    input.val(currentVal + 1 + '');
                    prisVareSamlet($('#pris_vare').val(), parseFloat(input.val()));
                }
            }
            if (parseFloat(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }
        }
    } else {
        errorAlert('#ny-bestilling', 'Fejl i antal vare felt. Prøv igen');
    }
});

$(document).on('change', '#pris_vare', function () {
    prisVareSamlet($(this).val(), parseInt($('#input-antal-vare').val()));
});

$(document).on('click', '#tilføj_vare', function () {
    $('#vælg_bestillings_dato').attr('min', moment().format('YYYY-MM-DDTHH:mm'));
    var valgtVare = $('a.list-group-item.active');
    var antal = $('#input-antal-vare').val();
    var pris = $('#pris_vare').val();
    var kommentar = $('#kommentar-vare').val();
    var vare = {id: valgtVare.data('id'), navn: valgtVare.text()};
    var bestillingsvare = $('#bestillingsvare-checkbox').prop('checked');

    if (vare != null && vare != undefined) {
        if (antal != null && antal != undefined) {
            if (pris != null && pris != undefined) {
                var bestillingslinje = new Bestillingslinje(pris, antal, vare, kommentar, bestillingsvare, false, false);
                bestillingslinjer.push(bestillingslinje);
                updateBestillingsliste();
                updateSamletPris();
                resetAllVare();
            } else {
                errorAlert('#ny-bestilling', 'Angiv venligst en pris - feltet må kun indeholde tal.');
            }
        } else {
            errorAlert('#ny-bestilling', 'Angiv venligst et antal.');
        }
    } else {
        errorAlert('#ny-bestilling', 'Vælg en vare');
    }

});

$(document).on('click', '#opret_bestilling', function () {
    var navn = $('#kunde_navn').val();
    var adresse = $('#kunde_adresse').val();
    var tlf = $('#kunde_tlf').val();
    var kommentar = $('#kommentar-bestilling').val();
    var afhentningsdato = moment($('#vælg_bestillings_dato').val()).toISOString();
    var bestillingsdato = moment().toISOString();
    var medarbejderID = $('#valg_medarbejder_dropdown').find(':selected').attr('data-id');
    var emballage = 'Nej';
    if ($('#emballage-checkbox').prop('checked')) {
        emballage = 'Ja - Ikke afleveret';
    }
    var bestilling = null;

    if (navn.length >= 2) {
        if (tlf.match(/^\d{8}$/)) {
            if (afhentningsdato != null && moment(afhentningsdato).isValid()) {
                if (medarbejderID != null) {
                    if (bestillingslinjer.length > 0) {
                        bestilling = new Bestilling(bestillingslinjer, bestillingsdato, navn, tlf, adresse, afhentningsdato, kommentar, emballage, medarbejderID);
                        if (bestilling != null) {
                            $.post('/bestilling', bestilling)
                                .done(function () {
                                    resetAllBestilling();
                                    successAlert('#ny-bestilling', 'Bestillingen blev oprettet.');
                                }).fail(function () {
                                    errorAlert('#ny-bestilling', 'Bestillingen kunne ikke oprettes. Tjek at alle felter er korrekt udfyldt og prøv igen.');
                                });
                        }
                    } else {
                        errorAlert('#ny-bestilling', 'Du mangler at tilføje en vare til bestillingen.');
                    }
                } else {
                    errorAlert('#ny-bestilling', 'Vælg en medarbejder.');
                }
            } else {
                errorAlert('#ny-bestilling', 'Vælg en gyldig afhentningsdato og tid.');
            }

        } else {
            errorAlert('#ny-bestilling', 'Telefon nummer skal være 8 cifre.');
        }
    } else {
        errorAlert('#ny-bestilling', 'Navn skal være minimum 2 bogstaver.');
    }
});