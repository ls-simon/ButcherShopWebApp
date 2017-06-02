$(function () {

$('#btnLogin').on('click', function (e) {
    e.preventDefault();
 $.post('/login', $('#loginForm').serialize()).done(function(res){
     if (res.redirect) {
         document.location.href = res.redirect;
     }
 });
});
    $(document).keypress(function(e) {
        if(e.which == 13) {
            $("#btnLogin").trigger('click');
        }
    });
});