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
    controls.minDistance = 80;
    controls.zoomSpeed = 0.1;

    light.init(scene, camera, controls);

    var loader = new THREE.STLLoader();

    loader.load('/models/' + url + '.stl', function (geometry) {
        geometry = new THREE.Geometry().fromBufferGeometry(geometry);
        var material;
        if (geometry.hasColors) {
            material = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: THREE.VertexColors });
        } else {
            material = new THREE.MeshPhongMaterial({
                color: 0x787878,
                specular: 0x111111,
                shininess: 200
            });
        }

        mesh = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();

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



        var volume = calculate.size(mesh);
        calculate.price(volume);

        scene.add(mesh);
        gui.init(boxSize, mesh, url, scene);

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
