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

        $('input[type=number]').on('change', function(e){
            var self = $(this);
            var value = parseInt(self.val());
            var min = parseInt(self.attr('min'));
            var max = parseInt(self.attr('max'));
            if(value < min || value > max){
                self.css('border', '1px solid red');
                $('#save').prop('disabled', true);

            }else{
                self.css('border', '1px solid #cacaca');
                $('#save').prop('disabled', false);
            }
        });

		var elem = new Foundation.Accordion($('[data-accordion]'));
    }


})();

function logEntries(e) {
    //console.log(e);
}