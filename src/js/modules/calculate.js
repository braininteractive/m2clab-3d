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
        var sizeX = boxSize.x ;
        var sizeY = boxSize.y ;
        var sizeZ = boxSize.z ;
        console.log(sizeX, sizeY, sizeZ);
        return (sizeX*sizeY*sizeZ);
    }
};