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
var SELECTED;
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
    var box = new THREE.Box3().setFromObject( mesh );
    boxSize = box.size();
    var sizeX = Math.round(boxSize.x * 100) / 100;
    var sizeY = Math.round(boxSize.y * 100) / 100;
    var sizeZ = Math.round(boxSize.z * 100) / 100;
    $('#sizeX').text(sizeX);
    $('#sizeY').text(sizeY);
    $('#sizeZ').text(sizeZ);

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
                    var fontSize = $(this).val();
                    scene.remove(text);
                    addEmbossing(scene, fontSize);
                });
                break;
        }
    });
    //$.each( data.attributes, function( attr, defs ) {
    //    params[attr] = defs.initial;
    //    switch(defs.type){
    //        case 'integer':
    //            configs[attr] = gui.add(params, attr, defs.range.min, defs.range.max);
    //            break;
    //        case 'color':
    //            configs[attr] = gui.addColor(params, attr);
    //            break;
    //        case 'text':
    //            configs[attr] = gui.add(params, attr);
    //            break;
    //        case 'checkbox':
    //            configs[attr] = gui.add(params, attr);
    //            break;
    //    }
    //});
    //
    //
    //$.each( configs, function( key, value ) {
    //    switch (key){
    //        case 'width':
    //            value.onChange( function( scaleValue){
    //                mesh.scale.set(scaleValue, params.height, params.depth);
    //                scale(mesh);
    //            });
    //            break;
    //        case 'height':
    //            value.onChange( function( scaleValue){
    //                mesh.scale.set(params.width, scaleValue, params.depth);
    //                scale(mesh);
    //            });
    //            break;
    //        case 'depth':
    //            value.onChange( function( scaleValue){
    //                mesh.scale.set(params.width, params.height, scaleValue);
    //                scale(mesh);
    //            });
    //            break;
    //        case 'color':
    //            value.onChange( function( colorValue){
    //                var colorObject = new THREE.Color( colorValue );
    //                mesh.material.color = colorObject;
    //            });
    //            break;
    //        case 'size':
    //            value.onChange( function( scaleValue){
    //                mesh.scale.set(scaleValue, scaleValue, scaleValue);
    //                scale(mesh);
    //            });
    //            break;
    //        case 'text':
    //            value.onFinishChange( function( textValue ){
    //                mesh.remove(text);
    //                addEmbossing(scene, textValue);
    //            });
    //            break;
    //        case 'fontSize':
    //            value.onFinishChange( function( fontSize ){
    //                scene.remove(text);
    //                addEmbossing(scene, fontSize);
    //            });
    //            break;
    //    }
    //});
}

function addEmbossing( scene, textValue) {
    var text3d = new THREE.TextGeometry( textValue, {
        size: 1,
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
    text = new THREE.Mesh( text3d, textMaterial );
    text.position.x = centerOffset;
    text.position.y = 0;
    text.position.z = -5;
    // text.position.z = Math.tan( Date.now() * 2 ) * 20;
    text.rotation.x = 0;
    text.rotation.y = Math.PI * 2;
    scene.add( text );
    SELECTED = text;
    objects.push( text );
}
