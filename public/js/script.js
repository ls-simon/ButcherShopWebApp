var alertTemplate;
var successTemplate;
var alertDeleteTemplate;
var alertDeleteItemTemplate;

$(function(){

    $.get('alert.hbs', function(template){
        alertTemplate = template;
    });

    $.get('success.hbs', function(template){
        successTemplate = template;
    });

    $.get('alert-delete.hbs', function(template){
        alertDeleteTemplate = template;
    });

    $.get('alert-delete-items.hbs', function(template){
        alertDeleteItemTemplate = template;
    });

    function changePage(page){
        $.get(page, function(data){
            $('#content').html(data);

        if (page == 'ny-bestilling.html') {
            resetAllBestilling();
            loadKategorier();
            loadMedarbejdere();
            hentAlleVarer();
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
                $('.selectpicker').selectpicker('mobile');
            }
        }
        if (page == 'bestillingsoversigt.html') {
            registerHelpers();
            loadBestillingslinjer();
            loadDatoPeriodeDropdown();
        }
        if (page == 'administration.html') {
            loadKategorier();
            visKategoriOversigt();
            visMedarbejderOversigt();
        }
        });
    }

    $(document).on('click','.changePage',function (e) {
        e.preventDefault();
        changePage($(this).attr('href'));
    });

    changePage('bestillingsoversigt.html');

    $.get('/navigation', function(data){
        $('body').prepend(data);
        $('.nav li').first().addClass('active');
    });
});

function errorAlert(pageID, message) {
    $('.alert').remove();
    var compiled = Handlebars.compile(alertTemplate);
    var html = compiled({fejltekst: message});
    $(pageID).prepend(html);
}

function successAlert(pageID, message) {
    $('.alert').remove();
    var compiled = Handlebars.compile(successTemplate);
    var html = compiled({succestekst: message});
    $(pageID).prepend(html);
}

function deleteAlert(pageID, item, id) {
    $('.alert').remove();
    var compiled = Handlebars.compile(alertDeleteTemplate);
    var html = compiled({item: item, id: id});
    $(pageID).prepend(html);
}

function deleteAlertItem(pageID, type, item, id) {
    $('.alert').remove();
    var compiled = Handlebars.compile(alertDeleteItemTemplate);
    var html = compiled({type:type, item: item, id: id});
    $(pageID).prepend(html);
}


var validation = {
    isName:function(str, num) {
        return str.length >= num;
    },
    isEmailAddress:function(str) {
        var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str);
    },
    isNotEmpty:function (str) {
        var pattern =/\S+/;
        return pattern.test(str);
    },
    isNumber:function(str) {
        var pattern = /^\d+$/;
        return pattern.test(str);
    },
    isSame:function(str1,str2){
        return str1 === str2;
    }
};