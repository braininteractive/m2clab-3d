var THREE = require('three.js');
var light = new THREE.DirectionalLight(0xdfebff, 1);
module.exports = {
    init: function (scene, camera, controls) {

        light.target.position.set(0, 0, 0);
        light.position.copy( camera.position );
        light.position.multiplyScalar(1.3);

        light.castShadow = true;
        light.shadowMapWidth = 1024;
        light.shadowMapHeight = 1024;
        var d = 400;
        light.shadowCameraLeft = -d;
        light.shadowCameraRight = d;
        light.shadowCameraTop = d;
        light.shadowCameraBottom = -d;

        light.shadowCameraFar = 1000;
        light.shadowDarkness = 0.5;
        light.position.copy( camera.position );

        scene.add(light);
        controls.addEventListener( 'change', function(){
            light.position.copy( camera.position );
        });
    }
};