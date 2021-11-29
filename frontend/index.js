// const _server = express()
//import _server from '../server.js'

/*----------------------------------------------------*/
/* Quote Loop
------------------------------------------------------ */

function fade($ele) {
    $ele.fadeIn(1000).delay(3000).fadeOut(1000, function() {
        var $next = $(this).next('.quote');
        fade($next.length > 0 ? $next : $(this).parent().children().first());
   });
}
fade($('.quoteLoop > .quote').first());


/*----------------------------------------------------*/
/* Navigation
------------------------------------------------------ */

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

// jQuery(document).ready(function($) {

//     $('.button').on('click',function (e) {
//         e.preventDefault();
//         console.log("button click")
//         // _server.post('/', function(req, res) {
//         // console.log(__dirname)
//         // res.sendFile(path.join(__dirname, '/findAPet.html'))
//         // });
//     });
// });


/*----------------------------------------------------*/
/* Smooth Scrolling
------------------------------------------------------ */

// jQuery(document).ready(function($) {

//    $('.smoothscroll').on('click',function (e) {
// 	    e.preventDefault();

// 	    var target = this.hash,
// 	    $target = $(target);

// 	    $('html, body').stop().animate({
// 	        'scrollTop': $target.offset().top
// 	    }, 800, 'swing', function () {
// 	        window.location.hash = target;
// 	    });
// 	});
// });


TweenMax.staggerFrom(".heading", 0.8, {opacity: 0, y: 20, delay: 0.2}, 0.4);