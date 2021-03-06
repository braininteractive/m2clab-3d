var THREE = require('three.js');
var OrbitControls = require('three-orbit-controls')(THREE);

var $ = require('jquery');
var Filesaver = require('filesaver.js');

var light = require('./light_module');
var gui = require('./gui');
var raycast = require('./raycast');
var calculate = require('./calculate');

var mouse = new THREE.Vector2();



require('../vendor/STLLoader');
require('../vendor/STLExport');

var rendererContainer;
var renderer;
var scene;
var camera, controls;
var mesh, width, height, depth, color;
var contentWidth, contentHeight;
var box, boxSize;

var params = {
    height: 0.5,
    width: 0.5,
    depth: 0.5,
    color: '#222222',
    positionY: -0.25,
    text: 'Test'
};

module.exports = {
    init: function(url){
        initGraphics(url);

        window.addEventListener('resize', onWindowResized);

        onWindowResized();

        requestAnimationFrame(render);
    },
    saveSTL: function( name ){
        var exporter = new THREE.STLBinaryExporter();
        var stlString = exporter.parse( scene );
        var blob = new Blob([stlString], {
            type: 'application/octet-binary'
        });
        Filesaver.saveAs(blob, name + '.stl');
    }
};


function initGraphics(url) {

    rendererContainer = document.getElementById('renderer');
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.setClearColor(0xFFFFFF, 0);

    rendererContainer.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x444444));

    camera = new THREE.PerspectiveCamera(60, contentWidth / contentHeight, 1, 100000);
    var cameraTarget = new THREE.Vector3( 0, 0, 0 );
    camera.position.set(0, 0, 100);
    camera.lookAt(cameraTarget);
    controls = new OrbitControls(camera, document.getElementById('renderer'));
    //controls.noZoom = true;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.zoomSpeed = 0.1;

    light.init(scene, camera, controls);

    var loader = new THREE.STLLoader();

    loader.load(url , function (geometry) {
        geometry = new THREE.Geometry().fromBufferGeometry(geometry);
        var material;
        material = new THREE.MeshPhongMaterial({
            color: 0x787878,
            specular: 0x111111,
            shininess: 200,
            vertexColors: THREE.FaceColors
        });


        mesh = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();
            // create an helper
        var correctForDepth = 3;
        var helper = new THREE.BoundingBoxHelper(mesh);
        helper.update();
        // get the bounding sphere
        var boundingSphere = helper.box.getBoundingSphere();
        // calculate the distance from the center of the sphere
        // and subtract the radius to get the real distance.
        var centr = boundingSphere.center;
        var radius = boundingSphere.radius;
        var distance = centr.distanceTo(camera.position) - radius;
        var realHeight = Math.abs(helper.box.max.y - helper.box.min.y);
        var fov = 2 * Math.atan(realHeight * correctForDepth / ( 2 * distance )) * ( 180 / Math.PI );
        camera.position.z = fov;
        camera.updateProjectionMatrix();

        var center = new THREE.Vector3();
        center.addVectors( geometry.boundingBox.min, geometry.boundingBox.max );
        center.multiplyScalar( - 0.5 );

        center.applyMatrix4( mesh.matrixWorld );


        mesh.position.set( center.x, center.y, center.z );
        mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -center.x, -center.y, -center.z ) );
        mesh.rotation.set(0, -Math.PI / 2, 0);
        mesh.scale.set(params.width, params.height, params.depth);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = 'model';

        var volume = calculate.size(mesh);
        calculate.price(volume);
        scene.add(mesh);

        gui.init(boxSize, mesh, url, scene);

        //TODO JSON export model and import JSON in configurator

    });
}


function updateWindowDimensions() {
    contentWidth = $('#renderer').width();
    contentHeight = $('#renderer').height();
}


function onWindowResized() {
    updateWindowDimensions();
    renderer.setSize( contentWidth, contentHeight );
    camera.aspect = contentWidth / contentHeight;
    camera.updateProjectionMatrix();
}


var lastTime = 0;

function render(t) {
    var delta = t - lastTime;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    lastTime = t;
}

// TODO onTouch Funktionen für Tablet Unterstützung

document.getElementById('renderer').onmousemove = function(event) {
    gui.moveText(event, camera, renderer, mesh, scene);
};
document.getElementById('renderer').ontouchmove = function(event) {
    gui.moveText(event, camera, renderer, mesh, scene);
};

document.getElementById('renderer').onmousedown = function(event) {
    gui.selectText(event, camera, renderer, mesh, controls, scene);
    if ($('.admin-renderer').length > 0){
        gui.toggleSelection(event, camera, renderer, mesh, controls, scene);
    }
};
document.getElementById('renderer').ontouchstart = function(event) {
  console.log(123);
    gui.selectText(event, camera, renderer, mesh, controls, scene);
    if ($('.admin-renderer').length > 0){
        gui.toggleSelection(event, camera, renderer, mesh, controls, scene);
    }
};

document.getElementById('renderer').onmouseup = function(event) {
    gui.dropText(event, camera, renderer, mesh, controls);
};
document.getElementById('renderer').ontouchend = function(event) {
    gui.dropText(event, camera, renderer, mesh, controls);
};
