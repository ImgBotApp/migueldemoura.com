//= require jquery
//= require turbolinks/dist/turbolinks.js
//= require throttle-debounce-fn/dist/throttle-debounce-fn.js
//= require fluidbox
//= require svgpolyfill.js

$(document).on('turbolinks:load', function (event) {
    // Fluidbox
    $('.fluidbox-trigger').fluidbox();

    // Share buttons
    $('.article-share a').on('click', function () {
        window.open($(this).attr('href'), 'Share', 'width=200,height=200,noopener');
        return false;
    });
});
