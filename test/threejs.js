const fs = require('fs');
const THREE = require('three');
const GIFEncoder = require('gifencoder');
const {createCanvas} = require('../lib');

const width = 512,
  height = 512;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const canvas = createCanvas(width, height);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const encoder = new GIFEncoder(width, height);
encoder.createReadStream().pipe(fs.createWriteStream('./snapshot/threejs-cube.gif'));
encoder.start();
encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
encoder.setDelay(16); // frame delay in ms
encoder.setQuality(10); // image quality. 10 is default.

let idx = 0;
function update() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  if(idx > 0) {
    encoder.addFrame(canvas.__ctx__);
    console.log(`add frame ${idx}`);
  }
  idx++;
  if(idx < 300) {
    setTimeout(update, 16);
  }
}
update();