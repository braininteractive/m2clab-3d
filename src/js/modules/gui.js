var $ = require('jquery');
//var dat = require('dat-gui');
var THREE = require('three.js');
var calculate = require('./calculate');
require('../vendor/Roboto-Black_Regular');

//var gui = new dat.GUI();
var boxSize;
var attributes;
var configs = {};
var text;
var SELECTED, TEXTOBJECT;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3();
var objects = [];

module.exports = {
    init: function(box, mesh, url, scene){
        mesh.scale.set(params.width, params.height, params.depth);
        buildGUI( mesh, scene);

    },
    moveText: function( event, camera, renderer, mesh ) {
        if ( SELECTED ){
            mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
            mouse.y = -( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

            raycaster.setFromCamera( mouse, camera );

            var intersects = raycaster.intersectObject( mesh );
            if ( intersects.length > 0 ) {

                //SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
                text.position.set(mouse.x, mouse.y, 0);
                if ( intersects.length > 0 ) {
                    text.position.set( 0, 0, 0 );
                    text.lookAt( intersects[ 0 ].face.normal );
                    text.position.copy( intersects[ 0 ].point );
                }

            }
        }

    },
    selectText: function( event, camera, renderer, mesh, controls ) {
        if (text !== undefined) {
            event.preventDefault();

            raycaster.setFromCamera( mouse, camera );

            var intersects = raycaster.intersectObjects( objects, true );

            if ( intersects.length > 0 ) {
                controls.enabled = false;
                SELECTED = intersects[ 0 ].object;
            }
        }
    },
    dropText: function( event, camera, renderer, mesh, controls ) {
        event.preventDefault();
        controls.enabled = true;

        //plane.position.copy( INTERSECTED.position );
        SELECTED = null;

        renderer.domElement.style.cursor = 'auto';
    }

};

function scale(mesh) {
    calculate.size(mesh);
    calculate.price(sizeX * sizeY * sizeZ);
}

function buildGUI( mesh, scene) {
    $.each($('input'), function(index, input){
        switch ($(input).attr('id')){
            case 'width':
                $(input).on('change', function(){
                    var scaleValue = parseFloat($(this).val());
                    params.width = scaleValue;
                    mesh.scale.set(scaleValue, params.height, params.depth);
                    scale(mesh);
                });
                break;
            case 'height':
                $(input).on('change', function(){
                    var scaleValue = parseFloat($(this).val());
                    params.height = scaleValue;
                    mesh.scale.set(params.width, scaleValue, params.depth);
                    scale(mesh);
                });
                break;
            case 'depth':
                $(input).on('change', function(){
                    var scaleValue = parseFloat($(this).val());
                    params.depth = scaleValue;
                    mesh.scale.set(params.width, params.height, scaleValue);
                    scale(mesh);
                });
                break;
            case 'color':
                $(input).on('change', function(){
                    var colorValue = $(this).val();
                    var colorObject = new THREE.Color( colorValue );
                    mesh.material.color = colorObject;
                });
                break;
            case 'size':
                $(input).on('change', function(){
                    var scaleValue = parseFloat($(this).val());
                    mesh.scale.set(scaleValue, scaleValue, scaleValue);
                    scale(mesh);
                });
                break;
            case 'text':
                $(input).on('change', function(){
                    var textValue = $(this).val();
                    mesh.remove(text);
                    addEmbossing(scene, textValue);
                });
                break;
            case 'fontSize':
                $(input).on('change', function(){
                    var textValue = $('#text').val();
                    var fontSize = $(this).val();
                    addEmbossing(scene, textValue, fontSize);
                });
                break;
            case 'fontHeight':
                $(input).on('change', function(){
                    var textValue = $('#text').val();
                    var fontSize = $(this).val();
                    addEmbossing(scene, textValue, fontSize);
                });
                break;
        }
    });
}

function addEmbossing( scene, textValue, fontSize = 20) {
    var text3d = new THREE.TextGeometry( textValue, {
        size: fontSize,
        height: 1,
        curveSegments: 2,
        font: 'Roboto Black'
    });
    text3d.computeBoundingBox();

    var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );

    var textMaterial = new THREE.MeshPhongMaterial({
        color: 0x787878,
        specular: 0x111111,
        shininess: 200
    });

    if (text){
        var posX = text.position.x;
        var posY = text.position.y;
        var posZ = text.position.z;
        scene.remove(text);
        text = new THREE.Mesh( text3d, textMaterial );

        text.position.x = posX;
        text.position.y = posY;
        text.position.z = posZ;

    } else {
        text = new THREE.Mesh( text3d, textMaterial );
        text.position.x = centerOffset;
        text.position.y = 0;
        text.position.z = -5;

        SELECTED = text;
    }

    scene.add( text );
    objects.push( text );
}