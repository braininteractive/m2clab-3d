var $ = require('jquery');
var THREE = require('three.js');

module.exports = {
    price: function(volume){
        var price = 0.1;
        $('.price-tag').html(Math.round(volume/100 * price));
    },
    size: function(mesh){
        var box = new THREE.Box3().setFromObject( mesh );
        var boxSize = box.size();

        var sizeX = boxSize.x * 2 ;
        var sizeY = boxSize.y * 2 ;
        var sizeZ = boxSize.z * 2 ;

        if($('input#width').length > 0){
            $('input#width').val(sizeX.toFixed(2));
        }
        if($('input#height').length > 0){
            $('input#height').val(sizeY.toFixed(2));
        }
        if($('input#depth').length > 0){
            $('input#depth').val(sizeZ.toFixed(2));
        }
        return (sizeX*sizeY*sizeZ);
    },
    manufacturability: function(mesh){
        ////StlFile.isCut ||
        cutPart(30, 30, 30);
        ////StlFile.isSeparated ||
        SurfaceSeparation(mesh);
        ////StlFile.RecognitionDone ||
        SurfaceRecognition();
        ////for (var c = 0; c < StlFile.SurfaceList.length; c++)(2 == StlFile.SurfaceList[c].type || 3 == StlFile.SurfaceList[c].type) && StlFile.SurfaceList[c].getGeometrieData();
        //StlFile.FacetDistanceDone ||
        Facet2Facet();
    }
};


function cutPart(x, y, z) {
    return true;
}

function SurfaceSeparation(mesh) {
    return true;
}

function SurfaceRecognition() {
    return true;
}

function Facet2Facet() {
    return true;
}