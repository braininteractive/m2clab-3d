var THREE = require('three.js');

module.exports = {
    init: function(scene) {
        var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 40, 40 ),
        new THREE.MeshPhongMaterial({
        color: 0x999999,
        specular: 0x101010
        })
        );
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.5;
        scene.add( plane );

        plane.receiveShadow = true;
    }
};
