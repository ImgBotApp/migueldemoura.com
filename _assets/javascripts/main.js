//= require zoom.js
//= require turbolinks/dist/turbolinks.js

new Zooming({customSize: '100%'});
document.addEventListener('turbolinks:load', function() {
    new Zooming({customSize: '100%'});
})
