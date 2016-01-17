var THREE = require('three.js');
var OrbitControls = require('three-orbit-controls')(THREE);

var $ = require('jquery');
var Filesaver = require('filesaver.js');

var ground = require('./ground_module');
var light = require('./light_module');
var calc = require('./calculate');
var gui = require('./gui');
var raycast = require('./raycast');
var calculate = require('./calculate');



require('../vendor/STLLoader');
require('../vendor/STLExport');


var rendererContainer;
var renderer;
var scene;
var camera, controls;
var mesh, width, height, depth, color;
var contentWidth, contentHeight;
var box, boxSize;
var edges;

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
        var exporter = new THREE.STLExporter();
        var stlString = exporter.parse( scene );
        var blob = new Blob([stlString], {
            type: 'text/plain'
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

    //ground.init(scene);

    camera = new THREE.PerspectiveCamera(60, contentWidth / contentHeight, 1, 100000);
    var cameraTarget = new THREE.Vector3( 0, 0, 0 );
    camera.position.set(0, 0, 10);
    camera.lookAt(cameraTarget);

    controls = new OrbitControls(camera, document.getElementById('renderer'));

    light.init(scene);
    //STL-Loader

    var loader = new THREE.STLLoader();


    loader.load('models/' + url + '.stl', function (geometry) {
        geometry = new THREE.Geometry().fromBufferGeometry(geometry);

        var material = new THREE.MeshPhongMaterial({
            color: 0x787878,
            specular: 0x111111,
            shininess: 200
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(0, -Math.PI / 2, 0);
        mesh.scale.set(params.width, params.height, params.depth);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        box = new THREE.Box3().setFromObject( mesh );
        boxSize = box.size();
        var sizeX = Math.round(boxSize.x * 100) / 100;
        var sizeY = Math.round(boxSize.y * 100) / 100;
        var sizeZ = Math.round(boxSize.z * 100) / 100;
        $('#sizeX').text(sizeX);
        $('#sizeY').text(sizeY);
        $('#sizeZ').text(sizeZ);

        calculate.price(sizeX * sizeY * sizeZ);

        scene.add(mesh);

        gui.init(boxSize, mesh, url, scene);
        edges = new THREE.EdgesHelper( mesh, 0x00ff00 );
        scene.add(edges);

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

document.getElementById('renderer').onmousemove = function(event) {
    gui.moveText(event, camera, renderer, mesh, scene);
};

document.getElementById('renderer').onmousedown = function(event) {
    gui.selectText(event, camera, renderer, mesh, controls);
};

document.getElementById('renderer').onmouseup = function(event) {
    gui.dropText(event, camera, renderer, mesh, controls);
};
