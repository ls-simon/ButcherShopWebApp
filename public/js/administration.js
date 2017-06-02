$(function () {

    Handlebars.registerHelper('wrapKategori', function (kategori) {
        if(kategori._id == undefined){
            return kategori;
        }else{
            return kategori._id;
        }

    });


    // Rediger medarbejder
    $(document).on('click', '#rediger_medarbejder', function () {

        if($('#medarbejder_oversigt a').hasClass( 'active' )){
            var item = $('#medarbejder_oversigt a.list-group-item.active');
            visOpretRedigerMedarbejderVindue({page:'redigerMedarbejder', _id:item.data('id'), navn: item.data('navn'), nr: item.data('nr')});
            $('#modalTitel').text('Ændre medarbejder');
            $('#rediger_opret_modal').modal('show');
        }
    });


    //Rediger varekategori - tjek at der trykkes på gemknap, reload varekategori dropdown
    $(document).on('click', '#rediger_varekategori', function () {

        if($('#kategori_oversigt a').hasClass( 'active' )){
            var item = $('#kategori_oversigt a.list-group-item.active');
            visOpretRedigerKategoriVindue({page:'redigerVarekategori', _id:item.data('id'), navn: item.data('navn')});
            $('#modalTitel').text('Ændre kategori');
            $('#rediger_opret_modal').modal('show');
        }
    });

    //Rediger vare
    $(document).on('click', '#rediger_vare', function () {


        if($('#vare_oversigt a').hasClass( 'active' )){
            var item = $('#vare_oversigt a.list-group-item.active');
            visOpretRedigerVareVindue({page:'redigerVare', _id:item.data('id'), navn: item.text(), enhed: item.data('enhed'), pris: item.data('field'), beskrivelse: item.data('beskrivelse'), varekategori: item.data('varekategori')});
            $('#modalTitel').text('Ændre vare');
            $('#rediger_opret_modal').modal('show');
        }
    });


    // Opret medarbejder
    $(document).on('click', '#opret_medarbejder', function () {
        $('#modalTitel').text('Opret medarbejder');
        visOpretRedigerMedarbejderVindue({page:'opretMedarbejder', _id:'', navn:'', nr:''});
        $('#rediger_opret_modal').modal('show');
    });


    //Opret varekategori - tjek at der trykkes på gemknap, reload varekategori dropdown
    $(document).on('click', '#opret_varekategori', function () {
        $('#modalTitel').text('Opret kategori');
        visOpretRedigerKategoriVindue({page:'opretVareKategori', _id:'', navn: ''});
        $('#rediger_opret_modal').modal('show');
    });

    //Opret vare
    $(document).on('click', '#opret_vare', function () {
        visOpretRedigerVareVindue({page:'opretVare', _id:'', navn: '', enhed: '', pris: '', beskrivelse: ''});
        $('#modalTitel').text('Opret vare');
        $('#rediger_opret_modal').modal('show');
    });


    //Tilføjer/fjerner active class fra kategori oversigten
    $(document).on('click', '#kategori_oversigt a', function () {
        $('.list-group-item.active').removeClass('active');
        $(this).addClass('active');
    });

    //Tilføjer/fjerner active class fra medarbejder oversigten
    $(document).on('click', '#medarbejder_oversigt a', function () {
        $('.list-group-item.active').removeClass('active');
        $(this).addClass('active');
    });

    //Slet medarbejder
    $(document).on('click', '#slet_medarbejder', function () {
        if($('#medarbejder_oversigt a').hasClass( 'active' )) {
            var item = $('#medarbejder_oversigt a.list-group-item.active');
            deleteAlertItem('#administration', 'slet_medarbejder_confirm', item.text(), item.data('id'));
        }
    });

    //Slet kategori
    $(document).on('click', '#slet_varekategori', function () {
        if($('#kategori_oversigt a').hasClass( 'active' )) {
            var item = $('#kategori_oversigt a.list-group-item.active');
            deleteAlertItem('#administration', 'slet_kategori_confirm', item.text(), item.data('id'));
        }
    });

    //Slet vare
    $(document).on('click', '#slet_vare', function () {
        if($('#vare_oversigt a').hasClass( 'active' )) {
            var item = $('#vare_oversigt a.list-group-item.active');
            deleteAlertItem('#administration', 'slet_vare_confirm', item.text(), item.data('id'));
        }
    });

    //Slet vare
    $(document).on('click', '#slet_vare_confirm', function () {

        $.delete('vare/'+ $(this).data('id'), '', function () {
            successAlert('#administration', 'Varen blev slettet');
            loadKategorier();
        }).fail(function () {
            errorAlert('#administration', 'Varen kunne ikke slettes. Prøv igen');
        });
    });

    //Slet kategori - reload dropdown
    $(document).on('click', '#slet_kategori_confirm', function () {

        $.delete('varekategori/'+ $(this).data('id'), '', function () {
            successAlert('#administration', 'Kategorien blev slettet');
            visKategoriOversigt();
            loadKategorier();
        }).fail(function () {
            errorAlert('#administration', 'Kunne ikke slette kategorien da den indeholder vare');
        });
    });

    //Slet medarbejder
    $(document).on('click', '#slet_medarbejder_confirm', function () {

        $.delete('medarbejder/'+ $(this).data('id'), '', function () {
            successAlert('#administration', 'Medarbejderen blev slettet');
            visMedarbejderOversigt();
        }).fail(function () {
            errorAlert('#administration', 'Medarbejderen kunne ikke slettes prøv igen');
        });
    });

    //Validering samt bestemmelse af vindues type.
    $(document).on('click', '#gem', function () {
        var item = $('#popupPage').data('page');

        //Medarbejder
        if(item == 'redigerMedarbejder' || item == 'opretMedarbejder'){

            //Data i input felter
            var nr = $('#input-nr').val();
            var navn = $('#input-navn').val();

            if(validation.isNumber(nr)){
                if(validation.isName(navn, 2)){
                    var obj = {navn:navn, nr:nr};
                    if(item == 'opretMedarbejder'){
                        opretMedarbejder(obj);
                        $('#rediger_opret_modal').modal('hide');
                    }else{
                        redigerMedarbejder($('#popupPage').data('id'), obj);
                        $('#rediger_opret_modal').modal('hide');
                    }
                }else{
                    errorAlert('#modalIndhold', 'Navnet er for kort');
                }
            }else{
                errorAlert('#modalIndhold', 'Forkert nummer, eller ikke et nummer');
            }
        }

        //Varekategori
        if(item == 'redigerVarekategori' || item == 'opretVareKategori') {

            //Data i input felter
            var navn = $('#input-navn').val();

            if(validation.isName(navn, 2)){

                var obj = {navn:navn};

                if(item == 'opretVareKategori'){
                    opretVarekategori(obj);
                    $('#rediger_opret_modal').modal('hide');
                }else{
                    redigerVarekategori($('#popupPage').data('id'), obj);
                    $('#rediger_opret_modal').modal('hide');
                }
            }else{
                errorAlert('#modalIndhold', 'Navnet er for kort');
            }
        }

        //Vare
        if(item == 'redigerVare' || item == 'opretVare'){

            //Data i input felter
            var navn = $('#input-navn').val();
            var enhed = $('#input-enhed').val();
            var pris = $('#input-pris').val();
            var beskrivelse = $('#input-beskrivelse').val();

            if(validation.isName(navn, 2)){
                if(validation.isName(navn, 1)){
                    if(validation.isNumber(pris)){
                        obj = {navn:navn, enhed:enhed, pris:pris, beskrivelse:beskrivelse, varekategori:$('#input-varekategori').val()};

                        if(item == 'opretVare'){
                            //Opret
                            opretVare(obj);
                            $('#rediger_opret_modal').modal('hide');
                        }else{
                            //Rediger
                            redigerVare($('#popupPage').data('id'), obj);
                            $('#rediger_opret_modal').modal('hide');
                        }
                    }else{
                        errorAlert('#modalIndhold', 'Angiv gyldig pris');
                    }
                }else{
                    errorAlert('#modalIndhold', 'Angiv enhed');
                }
            }else{
                errorAlert('#modalIndhold', 'Navnet er for kort');
            }

        }
    });
});


var medarbejderHBS;
var kategoriHBS;

$.get('kategori_oversigt.hbs', function(data){
    kategoriHBS = data;
});

$.get('medarbejder_oversigt.hbs', function(data){
    medarbejderHBS = data;
});

function visKategoriOversigt(){
    $.getJSON('varekategori/', function(data){
        $('#kategori_oversigt a').remove();
        var compiled = Handlebars.compile(kategoriHBS);
        var obj = {varekategorier: data};
        var html = compiled(obj);
        $('#kategori_oversigt').html(html);
    });
}

function visMedarbejderOversigt(){
    $.getJSON('medarbejder/', function(data){
        $('#medarbejder_oversigt a').remove();
        var compiled = Handlebars.compile(medarbejderHBS);
        var obj = {medarbejder: data};
        var html = compiled(obj);
        $('#medarbejder_oversigt').html(html);
    });
}

function visOpretRedigerMedarbejderVindue(data){
    $.get('medarbejder.hbs', function(template){
        var compiled = Handlebars.compile(template);
        var html = compiled(data);
        $('#modalIndhold').html(html);
    });
}

function visOpretRedigerKategoriVindue(data){
    $.get('kategori.hbs', function(template){
        var compiled = Handlebars.compile(template);
        var html = compiled(data);
        $('#modalIndhold').html(html);
    });
}


function visOpretRedigerVareVindue(data){
    $.getJSON('varekategori/', function (kategorier) {
        data.varekategorier = [];
        $.get('vare.hbs', function(template){

            for(var i = 0; i < kategorier.length; i++){
                if(validation.isSame(kategorier[i]._id, data.varekategori)){
                    data.varekategorier.push({_id:kategorier[i]._id, navn: kategorier[i].navn, selected: 'selected'});
                }else{
                    data.varekategorier.push({_id:kategorier[i]._id, navn: kategorier[i].navn, selected: ''});
                }
            }

            var compiled = Handlebars.compile(template);
            var html = compiled(data);
            $('#modalIndhold').html(html);
        });

    });
}


// MEDARBEJDER
// =============================================================================

function opretMedarbejder(data){
    $.post('/medarbejder', data)
        .done(function() {
            successAlert('#administration', 'Medarbejderen blev oprettet');
            visMedarbejderOversigt();
        }).fail(function() {
            errorAlert('#administration', 'Medarbejderen kunne ikke oprettes');
        });
}


function redigerMedarbejder(id, data) {
    $.put('/medarbejder/' + id, data, function () {
    }).done(function () {
        successAlert('#administration', 'Medarbejderen blev ændret');
        visMedarbejderOversigt();
    }).fail(function () {
        errorAlert('#administration', 'Medarbejderen kunne ikke ændres');
    });
}


// VAREKATEGORI
// =============================================================================

function opretVarekategori(data){
    $.post('/varekategori', data)
        .done(function() {
            successAlert('#administration', 'Varekategorien blev oprettet');
            visKategoriOversigt();
            loadKategorier();
        }).fail(function() {
            errorAlert('#administration', 'Varekategorien kunne ikke oprettes');
        });
}


function redigerVarekategori(id, data) {
    $.put('/varekategori/' + id, data, function () {
    }).done(function () {
        successAlert('#administration', 'Varekategorien blev ændret');
        visKategoriOversigt();
        loadKategorier();
    }).fail(function () {
        errorAlert('#administration', 'Varekategorien kunne ikke ændres');
    });
}


// VARE
// =============================================================================

function opretVare(data){
    $.post('/vare', data)
        .done(function() {
            successAlert('#administration', 'Varen blev oprettet');
            loadKategorier();
        }).fail(function() {
            errorAlert('#administration', 'Varen kunne ikke oprettes');
        });
}


function redigerVare(id, data) {
    $.put('/vare/' + id, data, function () {
    }).done(function () {
        successAlert('#administration', 'Varen blev ændret');
        loadKategorier();
    }).fail(function () {
        errorAlert('#administration', 'Varen kunne ikke ændres');
    });
}


