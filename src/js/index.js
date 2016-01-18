var scene = require('./modules/scene');
var $ = require('jquery');
const fs = require('fs');

( function() {
    if( $('#renderer').length > 0){
        scene.init(model);
        $('#save').on('click', function(){
            scene.saveSTL( 'modified' );
        });
    }
})();

function logEntries(e) {
    //console.log(e);
}