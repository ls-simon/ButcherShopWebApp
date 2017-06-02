/**
 * Created by Marina on 08/05/2017.
 */
var fuseBestilling;

var bestillingsTemplate;

function loadBestillingslinjer() {
    $.getJSON('/bestilling', function (data) {
        $.get('bestilling_oversigt.hbs', function (template) {
            bestillingsTemplate = template;
        });
        fuseBestilling = new Fuse(data, optionBestilling);

    }).done(function () {

    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Bestillinger kunne ikke hentes. Prøv igen');
    });
}

function hentBestillingsinfo(id) {
    $.getJSON('/bestilling/' + id, function (data) {
        $.get('rediger_bestilling.hbs', function (template) {
            var compiled = Handlebars.compile(template);
            var html = compiled(data[0]);
            $('#rediger_bestillingsinfo').html(html);
        });
    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Bestillingen kunne ikke redigeres. Prøv igen.');
    });
}

function hentBestillingslinjer(id) {
    $.getJSON('/bestilling/' + id, function (data) {
        $.get('rediger_bestillingslinjer.hbs', function (template) {
            var compiled = Handlebars.compile(template);
            var html = compiled(data[0]);
            $('#rediger_bestillingslinjer').html(html);
            $('#rediger_bestillingslinjer').attr('data-id', id);
        });
    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Bestillingen kunne ikke redigeres. Prøv igen.');
    });
}

function hentRedigerBestillingslinje(id) {
    $.getJSON('/bestillingsLinje/' + id, function (data) {
        $.get('rediger_vare.hbs', function (template) {
            var compiled = Handlebars.compile(template);
            var html = compiled(data[0]);
            $('#rediger_bestillingslinjer').html(html);
        });
    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Bestillingen kunne ikke redigeres. Prøv igen.');
    });
}

function hentNyBestillingslinje() {
    $.get('tilføj_vare.hbs', function (template) {
        var compiled = Handlebars.compile(template);
        var html = compiled();
        $('#rediger_bestillingslinjer').html(html);
        loadKategorier();
    });
}

function redigerBestillingsinfo(id, obj) {
    $.put('/bestilling/' + id, obj, function () {
    }).done(function () {
        $('#rediger_bestillingsinfo_modal').modal('hide');
        successAlert('#bestillingsoversigt', 'Ændringerne blev gemt.');
        $('#valg_periode_dropdown').trigger('change');
    }).fail(function () {
        errorAlert('rediger_bestillingsinfo', 'Ændringerne blev ikke gemt. Tjek venligst at alle felter er korrekt udfyldt.');
    });
}

function redigerBestillingslinje(id, obj) {
    $.put('/bestillingsLinje/' + id, obj, function () {
    }).done(function () {
        successAlert('#rediger_bestillingslinjer_modal', 'Ændringen blev gemt.');
        $('#valg_periode_dropdown').trigger('change');
        hentBestillingslinjer(id);
    }).fail(function () {
        errorAlert('#rediger_bestillingslinjer_modal', 'Ændringerne blev ikke gemt. Tjek venligst at alle felter er korrekt udfyldt.');
    });
}

function sletBestilling(id) {
    $.delete('/bestilling/' + id, '', function () {
    }).done(function () {
        successAlert('#bestillingsoversigt', 'Bestillingen blev slettet');
        $('#valg_periode_dropdown').trigger('change');
    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Bestillingen kunne ikke slettes. Prøv igen.');
    });
}

function sletBestillingslinje(bestillingsid, id) {
    $.delete('/bestillingsLinje/' + id, {id: bestillingsid}, function () {
    }).done(function () {
        successAlert('#bestillingsoversigt', 'Varen blev slettet');
        $('#valg_periode_dropdown').trigger('change');
        hentBestillingslinjer(bestillingsid);
    }).fail(function () {
        errorAlert('#rediger_bestillingslinjer', 'Varen kunne ikke slettes. Prøv igen.');
    });
}

function checkAntalManglendeBestilt(id) {
    var antalBestillingsvarer = 0;
    $.getJSON('/bestilling/' + id, function (data) {
        $.each(data[0].bestillingLinjer, function (i, item) {
            if (item.bestillingsvare === true) {
                if (item.bestilt === false) {
                    antalBestillingsvarer++;
                }
            }
        });
    }).done(function () {
        var badge = '';
        if (antalBestillingsvarer > 1) {
            badge = 'Du mangler at bestille ' + antalBestillingsvarer + ' varer.';
            $('#bestillingsvareBadge-'+id).text(badge);
        } else if (antalBestillingsvarer == 1) {
            badge = 'Du mangler at bestille ' + antalBestillingsvarer + ' vare.';
            $('#bestillingsvareBadge-'+id).text(badge);
        } else {
            $('#bestillingsvareBadge-'+id).empty();
        }


    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Der skete en fejl.');
    });
}

function checkAntalProcentPakket(id) {
    var antal = 0;
    var pakket = 0;
    var procent = 0;
    $.getJSON('/bestilling/' + id, function (data) {
        $.each(data[0].bestillingLinjer, function (i, linje) {
            if (linje.pakket) {
                pakket++;
            }
            antal++;
        });

        procent = Math.round((pakket / antal) * 100) + '%';

    }).done(function () {
        var badge = '';
        if (pakket === 0) {
            badge = 'ikke pakket';
            $('#pakketBadge-'+id).text(badge);
        } else {
            badge = procent + ' pakket';
            $('#pakketBadge-'+id).text(badge);
        }
    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Der skete en fejl.');
    });
}

function registerHelpers() {
    Handlebars.registerHelper('dateFormat', function (date) {
        if (moment(date).isValid()) {
            date = moment(date);
            return date.format('ll');
        } else {
            return date;
        }
    });

    Handlebars.registerHelper('ugeDag', function (date) {
        if (moment(date).isValid()) {
            date = moment(date);
            return date.format('dddd');
        } else {
            return date;
        }
    });

    Handlebars.registerHelper('smallDateTimeFormat', function (date) {
        if (moment(date).isValid()) {
            date = moment(date);
            return date.format('DD MMM HH:mm');
        } else {
            return date;
        }
    });

    Handlebars.registerHelper('timeFormat', function (date) {
        if (moment(date).isValid()) {
            date = moment(date);
            return date.format('HH:mm');
        } else {
            return date;
        }
    });

    Handlebars.registerHelper('dateTimeFormatDatePicker', function (date) {
        if (moment(date).isValid()) {
            date = moment(date);
            return date.format('YYYY-MM-DDTHH:mm');
        } else {
            return date;
        }
    });

    Handlebars.registerHelper('dateFormatForID', function (date) {
        if (moment(date).isValid()) {
            date = moment(date);
            return date.format('YYYY-MM-DD');
        } else {
            return date;
        }
    });

    Handlebars.registerHelper('bestillingsvarerBadge', function (bestillingslinjer) {
        var antalBestillingsvarer = 0;
        $.each(bestillingslinjer, function (i, item) {
            if (item.bestillingsvare === true) {
                if (item.bestilt === false) {
                    antalBestillingsvarer++;
                }
            }
        });
        if (antalBestillingsvarer == 1) {
            return 'Du mangler at bestille ' + antalBestillingsvarer + ' vare.';
        } else if (antalBestillingsvarer > 1) {
            return 'Du mangler at bestille ' + antalBestillingsvarer + ' varer.';
        } else {
            return '';
        }
    });

    Handlebars.registerHelper('prisTotal', function (n1, n2) {
        return (n1 * n2).toFixed(2);
    });

    Handlebars.registerHelper('highlightKommentar', function (kommentar) {
        if (kommentar.length > 0) {
            return '<mark>' + kommentar + '</mark>';
        }
    });

    Handlebars.registerHelper('bestillingsVare', function (bestillingsvare) {
        if (bestillingsvare) {
            return 'Ja';
        } else {
            return 'Nej';
        }
    });

    Handlebars.registerHelper('bestillingsVareTrueFalse', function (bestillingsvare) {
        if (bestillingsvare) {
            return 'checked';
        }
    });

    Handlebars.registerHelper('bestillingsVareCheckbox', function (bestillingsvare, bestilt) {
        if (bestillingsvare) {
            if (bestilt) {
                $('.bestil-true').removeClass('bestil-true');
                return '<input type=\'checkbox\' id=\'vare_bestilt_checkbox\' checked>';
            } else {
                return '<input type=\'checkbox\' id=\'vare_bestilt_checkbox\'>';
            }
        }
    });

    Handlebars.registerHelper('bestillingsvareHighlight', function (bestillingsvare, bestilt) {
        if (bestillingsvare) {
            if (!bestilt) {
                return 'bestil-true';
            }
        }
    });

    Handlebars.registerHelper('emballageLabel', function (emballage) {
        if (emballage == 'Ja - Ikke afleveret') {
            return 'Ja';
        } else if (emballage == 'Ja - Afleveret') {
            return 'Ja';
        } else {
            return emballage;
        }
    });

    Handlebars.registerHelper('varePakketCheckbox', function (pakket) {
        if (pakket) {
            return '<input id=\'vare_pakket_checkbox\' type=\'checkbox\' checked>';
        } else {
            return '<input id=\'vare_pakket_checkbox\' type=\'checkbox\'>';
        }
    });

    Handlebars.registerHelper('emballageCheckbox', function (emballage) {
        if (emballage == 'Ja - Ikke afleveret') {
            return '<input type=\'checkbox\' id=\'emballage_afleveret_checkbox\'>';
        } else if (emballage == 'Ja - Afleveret') {
            return '<input type=\'checkbox\' id=\'emballage_afleveret_checkbox\' checked>';
        }
    });

    Handlebars.registerHelper('checkVare', function (vare, arg) {
        if (vare === null) {
            return 'er slettet.';
        } else {
            return vare[arg];
        }
    });

    Handlebars.registerHelper('checkStatus', function (status, value) {
        if (status == value) {
            return 'selected';
        }
    });

    Handlebars.registerHelper('samletPris', function (bestillingLinjer) {
        var samletPris = 0;
        $.each(bestillingLinjer, function (i, linje) {
            samletPris += linje.pris * linje.antal;
        });
        return samletPris.toFixed(2);
    });

    Handlebars.registerHelper('udregnProcentPakket', function (bestillingLinjer) {
        var antal = 0;
        var pakket = 0;
        $.each(bestillingLinjer, function (i, linje) {
            if (linje.pakket) {
                pakket++;
            }
            antal++;
        });
        if (pakket === 0){
            return 'ikke';
        }
        else{

            return Math.round((pakket / antal) * 100) + '%';

        }});
}

function loadDatoPeriodeDropdown() {
    $.get('valg_periode_dropdown.hbs', function (template) {
        var compiled = Handlebars.compile(template);
        var html = compiled({
            dateToday: moment(),
            dateTomorrow: moment().add(1, 'days'),
            dateStart: moment().startOf('isoWeek'),
            dateEnd: moment().endOf('isoWeek'),
            dateStartNextWeek: moment().add(1, 'weeks').startOf('isoWeek'),
            dateEndNextWeek: moment().add(1, 'weeks').endOf('isoWeek')
        });
        $('#periodevalg').html(html);
        $('.selectpicker').selectpicker();
        $('#valg_periode_dropdown').trigger('change');
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $('.selectpicker').selectpicker('mobile');
        }
    });
}

function loadStatusDropdown() {
    $('.selectpicker').selectpicker();
}

function bestillingerPeriode(startDato, slutDato) {

    $.get('bestilling_oversigt.hbs', function (template) {

        $.getJSON('/bestilling/dato/' + startDato + '/' + slutDato, function (data) {

            var html = '';
            var currentDato;
            var compiled = Handlebars.compile(template);

            if(data[0] !== undefined){
                currentDato = moment(data[0].afhentningsDato).format('dddd [ d. ] D MMM');
                html += '<h3 class="ugeDag text-left">'+currentDato+'</h3>';
            }else{
                $('#bestillings_oversigt_indhold').html('<h3 class="ugeDag text-left">Der findes ingen bestillinger i denne periode</h3>');
                return;
            }

            var bestillinger = [];
            for(var i = 0; i < data.length; i++ ){

                var dato = moment(data[i].afhentningsDato).format('dddd [ d. ] D MMM');
                if(validation.isSame(dato, currentDato)){
                    bestillinger.push(data[i]);
                }else{
                    currentDato = dato;
                    var obj = {bestilling: bestillinger};
                    html += compiled(obj);
                    html += '<h3 class="ugeDag text-left">'+currentDato+'</h3>';
                    bestillinger = [];
                    bestillinger.push(data[i]);
                }

            }
            var obj = {bestilling: bestillinger};
            html += compiled(obj);
            $('#bestillings_oversigt_indhold').html(html);
            loadStatusDropdown();
        }).fail(function () {
            errorAlert('#bestillingsoversigt', 'Kunne ikke hente bestillingerne');
        });
    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Kunne ikke hente templatet bestillingsoversigt');
    });
}

$.delete = function (url, data, callback, type) {

    if ($.isFunction(data)) {
        type = type || callback,
            callback = data,
            data = {};
    }

    return $.ajax({
        url: url,
        type: 'DELETE',
        success: callback,
        data: data,
        contentType: type
    });
};

$.put = function (url, data, callback, type) {

    if ($.isFunction(data)) {
        type = type || callback,
            callback = data,
            data = {};
    }

    return $.ajax({
        url: url,
        type: 'PUT',
        success: callback,
        data: data,
        contentType: type
    });
};

//fuseBestilling.js search option
var optionBestilling = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        'kundeNavn', 'kundeTlf'
    ]
};


//----------event triggers--------------

$(document).on('keyup', '#søg_bestilling', function () {
    var search = $(this).val();
    var result = fuseBestilling.search(search);
    var compiled = Handlebars.compile(bestillingsTemplate);
    var obj = {bestilling: result};
    var html = compiled(obj);
    $('#bestillings_oversigt_indhold').html(html);
    loadStatusDropdown();
});

$(document).on('change', '#valg_periode_dropdown', function () {
    if ($(this).find(':selected').attr('id') == 'vælg_periode_manuelt') {
        $(this).remove();
        $.get('datepickers.hbs', function (template) {
            var compiled = Handlebars.compile(template);
            startDato = moment().format('YYYY-MM-DD');
            slutDato = moment().add(1, 'months').format('YYYY-MM-DD');
            var html = compiled({
                startDato: startDato,
                slutDato: slutDato
            });
            $('#periodevalg').html(html);
        });
    }
});

var startDato;
var slutDato;

$(document).on('change', '#bestilling_periode_startdato', function () {
    startDato = $('#bestilling_periode_startdato').val();
    if(moment(startDato).isBefore(moment(slutDato))){
        bestillingerPeriode(startDato, slutDato);
    }else{
        errorAlert('#bestillingsoversigt', 'Du skal vælge gyldig start og slut dato');
    }
});

$(document).on('change', '#bestilling_periode_slutdato', function () {
    slutDato = $('#bestilling_periode_slutdato').val();
    if(moment(startDato).isBefore(moment(slutDato))){
        bestillingerPeriode(startDato, slutDato);
    }else{
        errorAlert('#bestillingsoversigt', 'Du skal vælge gyldig start og slut dato');
    }
});

$(document).on('change', '#valg_periode_dropdown', function () {
    if ($(this).find(':selected').attr('data-datotype') == 'dato') {
        var dato = $(this).find(':selected').attr('data-id');

        $.getJSON('/bestilling/dato/' + dato, function (data) {
            var compiled = Handlebars.compile(bestillingsTemplate);
            var obj = {bestilling: data};
            var html = compiled(obj);
            $('#bestillings_oversigt_indhold').html(html);
        }).fail(function () {
            errorAlert('#bestillingsoversigt', 'Bestillinger kunne ikke hentes. Prøv igen');
        });
    } else if ($(this).find(':selected').attr('data-datotype') == 'periode') {

        var startDato = $(this).find(':selected').attr('data-id-start');
        var slutDato = $(this).find(':selected').attr('data-id-slut');

        bestillingerPeriode(startDato, slutDato);
    }
});

$(document).on('click', '#tilbage_vælg_periode_dropdown', function () {
    $('#periodevalg').empty();
    loadDatoPeriodeDropdown();
});

$(document).on('click', '#bestilling_udskriv', function (e) {
    e.preventDefault();
    printpdf($(this).data('id'));
});

$(document).on('click', '#button_rediger_bestillinginfo', function () {
    var id = $(this).attr('data-id');
    hentBestillingsinfo(id);
});

$(document).on('click', '#button_rediger_bestillingslinjer', function () {
    var id = $(this).attr('data-id');
    hentBestillingslinjer(id);
});

$(document).on('click', '#rediger_vare', function () {
    var id = $(this).attr('data-id');
    hentRedigerBestillingslinje(id);
});


$(document).on('click', '#ny_vare', function () {
    hentNyBestillingslinje();
});

$(document).on('click', '#tilføj_vare_bestillingsoversigt', function () {
    var bestillingsid = $('#rediger_bestillingslinjer').attr('data-id');
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
                $.post('/bestillingsLinje/opret/' + bestillingsid, bestillingslinje, function () {
                }).done(function () {
                    successAlert('#rediger_bestillingslinjer_modal', 'Varen blev tilføjet.');
                    hentBestillingslinjer($('#rediger_bestillingslinjer').attr('data-id'));
                }).fail(function () {
                    errorAlert('#rediger_bestillingslinjer', 'Varen blev ikke tilføjet. Tjek venligst at alle felter er korrekt udfyldt.');
                });
            } else {
                errorAlert('#rediger_bestillingslinjer', 'Angiv venligst en pris - feltet må kun indeholde tal.');
            }
        } else {
            errorAlert('#rediger_bestillingslinjer', 'Angiv venligst et antal.');
        }
    } else {
        errorAlert('#rediger_bestillingslinjer', 'Vælg en vare');
    }
});

$(document).on('click', '#button_slet_bestilling', function () {
    deleteAlert('#bestillingsoversigt', 'bestillingen', $(this).attr('data-id'));
});


$(document).on('click', '#slet_vare', function () {
    deleteAlert('#rediger_bestillingslinjer', 'varen', $(this).attr('data-id'));
});

$(document).on('click', '#bekræft_slet', function () {
    var id = $(this).attr('data-id');
    var bestillingsid = $('#rediger_bestillingslinjer').attr('data-id');
    if ($(this).attr('data-objekt') == 'varen') {
        sletBestillingslinje(bestillingsid, id);
    } else {
        sletBestilling(id);
    }

});

$(document).on('change', '#vare_bestilt_checkbox', function () {
    var id = $(this).closest('tr').attr('data-id');
    var bestillingsid = $(this).closest('table').attr('data-id');
    var obj = {};
    if ($(this).is(':checked')) {
        $(this).closest('tr').removeClass('bestil-true');
        obj = {bestilt: true};
    } else {
        $(this).closest('tr').addClass('bestil-true');
        obj = {bestilt: false};
    }
    $.put('/bestillingsLinje/' + id, obj, function () {

    }).done(function () {
        checkAntalManglendeBestilt(bestillingsid);
    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Markering af bestilling kunne ikke gemmes. Prøv igen.');
    });
});

$(document).on('change', '#emballage_afleveret_checkbox', function () {
    var id = $(this).closest('.panel-collapse').attr('id');
    var obj = {};
    if ($(this).is(':checked')) {
        obj = {emballage: 'Ja - Afleveret'};
    } else {
        obj = {emballage: 'Ja - Ikke afleveret'};
    }
    $.put('/bestilling/' + id, obj, function () {
    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Markering af emballage kunne ikke gemmes. Prøv igen.');
    });
});

$(document).on('change', '#vare_pakket_checkbox', function () {
    var id = $(this).closest('tr').attr('data-id');
    var bestillingsid = $(this).closest('table').attr('data-id');
    var obj = {};
    if ($(this).is(':checked')) {
        obj = {pakket: true};
    } else {
        obj = {pakket: false};
    }
    $.put('/bestillingsLinje/' + id, obj, function () {
    }).done(function () {
        checkAntalProcentPakket(bestillingsid);
    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Markering af pakning kunne ikke gemmes. Prøv igen.');
    });
});

$(document).on('click', '#button_gem_rediger_bestilling', function () {
    //TODO: Validering
    var id = $('#kunde_info').attr('data-id');
    var kundeNavn = $('#rediger_kunde_navn').val();
    var kundeAdresse = $('#rediger_kunde_adresse').val();
    var kundeTlf = $('#rediger_kunde_tlf').val();
    var kommentar = $('#rediger-kommentar-bestilling').val();
    var dato = $('#rediger_afhentning_dato').val();
    var obj = {
        kundeNavn: kundeNavn,
        kundeAdresse: kundeAdresse,
        kundeTlf: kundeTlf,
        kommentar: kommentar,
        afhentningsDato: dato
    };
    redigerBestillingsinfo(id, obj);
});

$(document).on('click', '#gem_rediger_vare', function () {
    var id = $(this).attr('data-id');
    var antal = $('#input-antal-vare').val();
    var kommentar = $('#rediger-kommentar-vare').val();
    var pris = $('#pris_vare').val();
    var bestillingsvare = $('#rediger-bestillingsvare-checkbox').is(':checked');
    if (validation.isNumber(antal) && antal !== null) {
        if (pris !== null) {
            var obj = {
                antal: antal,
                pris: pris,
                kommentar: kommentar,
                bestillingsvare: bestillingsvare
            };
            redigerBestillingslinje(id, obj);
            hentBestillingslinjer($('#rediger_bestillingslinjer').attr('data-id'));
        } else {
            errorAlert('#rediger_bestillingslinjer_modal', 'Pris er ikke korrekt.');
        }
    } else {
        errorAlert('#rediger_bestillingslinjer_modal', 'Antal er ikke korrekt.');
    }
});

$(document).on('click', '#tilbage_rediger_vare', function () {
    hentBestillingslinjer($('#rediger_bestillingslinjer').attr('data-id'));
});

$(document).on('change', '#valg_status_dropdown', function () {
    var id = $(this).attr('data-bestilling');
    var status = $(this).selectpicker('val');
    var obj = {status: status};
    $.put('/bestilling/' + id, obj, function () {
    }).done(function () {
        successAlert('#bestillingsoversigt', 'Status blev ændret til ' + status + '.');
    }).fail(function () {
        errorAlert('#bestillingsoversigt', 'Markering af status kunne ikke gemmes. Prøv igen.');
    });
});
