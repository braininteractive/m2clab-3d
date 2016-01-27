var scene = require('./modules/scene');
var $ = require('jquery');
const fs = require('fs');
var Accordion = require('foundation.accordion');

( function() {
    if( $('#renderer').length > 0){
        scene.init(model);
        $('#save').on('click', function(){
            scene.saveSTL( 'modified' );
        });

        $('.fa-expand').on('click', function(){
            $('#renderer').toggleClass('expanded');
            $(window).trigger('resize');
        });

		var elem = new Foundation.Accordion($('[data-accordion]'));
    }


})();

function logEntries(e) {
    //console.log(e);
}