//= require jquery
//= require throttle-debounce-fn/dist/throttle-debounce-fn.js
//= require fluidbox

$(function() {
    // Fluidbox
    var fluidbox = $('.fluidbox');
    fluidbox.fluidbox();

    $(document).on('keydown', function(e) {
        if (e.keyCode == 27) {
            fluidbox.fluidbox('close');
        }
    });

    $(window).scroll($.throttle(500, function() {
        fluidbox.fluidbox('close');
    }));
});