//= require turbolinks/dist/turbolinks.js
//= require zooming/build/zooming.js

document.addEventListener('turbolinks:load', function() {
    new Zooming({customSize: '100%', scaleBase: 0.9, scaleExtra: 0, enableGrab: false});
})
