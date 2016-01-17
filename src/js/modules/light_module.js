var THREE = require('three.js');


module.exports = {
    init: function (scene) {
        var light = new THREE.DirectionalLight(0xdfebff, 1);
        light.target.position.set(0, 0, 0);
        light.position.set(0, 200, 0);
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

        scene.add(light);
    }
};
