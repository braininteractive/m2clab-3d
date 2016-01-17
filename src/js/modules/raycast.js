var $ = require('jquery');
var THREE = require('three.js');

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var camera, scene, renderer;

module.exports = {
    init: function(getcamera, getscene, getrenderer){
        camera = getcamera;
        scene = getscene;
        renderer = getrenderer;
        window.addEventListener( 'mouseup', onMouseClick, false );
    }
};

function onMouseClick( event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    renderRay();
}

function renderRay() {
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );
    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children );
    //console.log(intersects.length);
    //for ( var i = 0; i < intersects.length; i++ ) {
    //    intersects[ i ].object.material.color.set( 0xff0000 );
    //
    //}
    renderer.render( scene, camera );

}
