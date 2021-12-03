$(window).scroll(function() {

    if ($(window).scrollTop() > 300) {
        $('.main_nav').addClass('sticky');
    } else {
        $('.main_nav').removeClass('sticky');
    }
});

// Mobile Navigation
$(document).ready(function() {
    $('.mobile-toggle').click(function() {
        console.log('event happened');
        if ($('.main_nav').hasClass('open-nav')) {
            $('.main_nav').removeClass('open-nav');
            console.log("part 1")
        } else {
            $('.main_nav').addClass('open-nav');
            console.log("part 2")
        }
    });
});

$(document).ready(function() {
    $('.main_nav li a').click(function() {
        console.log("clicked stuff")
        if ($('.main_nav').hasClass('open-nav')) {
            $('.navigation').removeClass('open-nav');
            $('.main_nav').removeClass('open-nav');
        }
    });
});


//TweenMax.staggerFrom(".heading", 0.8, {opacity: 0, y: 20, delay: 0.2}, 0.4);

