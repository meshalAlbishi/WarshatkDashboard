$(document).ready(() => {
    $('#inc-navbar').load('html/HomePage/navbar.html');
    $('#inc-home').load('html/HomePage/home.html');
    $('#inc-about').load('html/HomePage/about.html');
    $('#inc-service').load('html/HomePage/service.html');
    $('#inc-contact').load('html/HomePage/contact.html');
    $('#inc-footer').load('html/HomePage/footer.html');
});


$('#btn').submit(() => alert("Message Sent!"));

$(window).on("load", function () {

    $(window).scroll(() => {

        if (scrollY > 20) {
            $('#navbar').addClass('sticky');
        }
        else {
            $('#navbar').removeClass('sticky');
        }
    });

});
