var $ = require('jquery');
var THREE = require('three.js');

module.exports = {
    price: function(volume){
        var price = 1;
        $('.price-tag').html(35 + Math.round(volume * price));
    },
    size: function(mesh){
        var box = new THREE.Box3().setFromObject( mesh );
        var boxSize = box.size();
        var sizeX = Math.round(boxSize.x * 100) / 100;
        var sizeY = Math.round(boxSize.y * 100) / 100;
        var sizeZ = Math.round(boxSize.z * 100) / 100;
        $('#sizeX').text(sizeX);
        $('#sizeY').text(sizeY);
        $('#sizeZ').text(sizeZ);
        return (sizeX*sizeY*sizeZ);
    }
};
