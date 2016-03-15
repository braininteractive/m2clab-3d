var $ = require('jquery');
const fs = require('fs');
var Accordion = require('foundation.accordion');
var List = require('list.js');

( function() {
    if( $('#renderer').length > 0){
        var scene = require('./modules/scene');

        scene.init(model);
        $('#save').on('click', function(){
            scene.saveSTL( 'modified' );
        });

        $('.renderer--expand').on('click', function(){
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

    var options = {
        valueNames: ['model--name']
    };

    var modelList = new List('models', options);
    console.log(modelList);

    $('[data-delete]').on('click', function(e){
        e.preventDefault();
        var self = $(this);
        if (confirm("Really delete this model?")) {
            $.ajax({
                    url: self.attr('data-url'),
                    type: "POST",//type of posting the data
                    data: self.attr('data-delete'),
                success: function (data){
                    var table = $(data).find('table');
                    $('table').replaceWith($(table));
                },
                error: function(xhr, ajaxOptions, thrownError){
                    //what to do in error
                },
                timeout : 15000//timeout of the ajax call
            });
        }

    });

    $( '.inputfile' ).each( function()
    {
        var $input	 = $( this ),
            $label	 = $input.next( 'label' ),
            labelVal = $label.html();

        $input.on( 'change', function( e )
        {
            var fileName = '';

            if( this.files && this.files.length > 1 )
                fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else if( e.target.value )
                fileName = e.target.value.split( '\\' ).pop();

            if( fileName ) {
                $label.find('span').html(fileName);
                $label.addClass('inputfile__chosen');
            }
            else {
                $label.html(labelVal);
                $label.addClass('inputfile__chosen');
            }
        });
    });


})();

function logEntries(e) {
    //console.log(e);
}