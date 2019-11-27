# node-canvas-webgl

Integration of [node-canvas](https://github.com/Automattic/node-canvas) and [headless-gl](https://github.com/stackgl/headless-gl).

## Demos:

#### with threejs

```js
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
  if(idx < 500) {
    setTimeout(update, 16);
  }
}
update();
```

![](https://p2.ssl.qhimg.com/t01abe0b6dc18945e43.gif)

#### with claygl

```js
const fs = require('fs');
const GIFEncoder = require('gifencoder');
const clay = require('claygl');
const {createCanvas} = require('../lib');

const width = 512,
  height = 512;

const canvas = createCanvas(width, height);

const encoder = new GIFEncoder(width, height);

let idx = 0;

// polyfill
global.document = {
  createElement() {
    return createCanvas(300, 150);
  },
};

clay.application.create(canvas, {

  width,
  height,

  init(app) {
    // Create camera
    this._camera = app.createCamera([0, 2, 5], [0, 0, 0]);

    // Create a RED cube
    this._cube = app.createCube({
      color: [1, 0, 0],
    });

    // Create light
    this._mainLight = app.createDirectionalLight([-1, -1, -1]);
    // app.createAmbientLight('#fff', 1.0);

    encoder.createReadStream().pipe(fs.createWriteStream('./snapshot/claygl-cube.gif'));
    encoder.start();
    encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
    encoder.setDelay(16); // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.
  },
  loop(app) {
    this._cube.rotation.rotateY(16 / 1000);
    if(idx > 0) {
      encoder.addFrame(canvas.__ctx__);
      console.log(`add frame ${idx}`);
    }
    idx++;
    if(idx > 197) {
      process.exit(-1);
    }
  },
});
```

![](https://p3.ssl.qhimg.com/t011d79d79adb1b649e.gif)

#### with babylonjs

```js
const fs = require('fs');
const BABYLON = require('babylonjs');
const {createCanvas} = require('../lib');

// polyfill
global.HTMLElement = function () {};
global.window = {
  setTimeout,
  addEventListener() {},
};
global.navigator = {};
global.document = {
  createElement() {
    return createCanvas(300, 150);
  },
  addEventListener() {},
};

// Get the canvas DOM element
const canvas = createCanvas(512, 512);

// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

// CreateScene function that creates and return the scene
const createScene = function () {
  // Create a basic BJS Scene object
  const scene = new BABYLON.Scene(engine);
  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  // Attach the camera to the canvas
  camera.attachControl(canvas, false);
  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
  // Move the sphere upward 1/2 of its height
  sphere.position.y = 1;
  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
  // Return the created scene
  return scene;
};

// call the createScene function
const scene = createScene();

scene.render();

fs.writeFileSync('./snapshot/snap-babylon.png', canvas.toBuffer());
```

![](https://p5.ssl.qhimg.com/t01d9af9c9428b18585.png)

#### with mesh.js

```js
const fs = require('fs');
const {Renderer, Figure2D, Mesh2D} = require('@mesh.js/core');
const {createCanvas, loadImage} = require('../lib');

const width = 512,
  height = 512;

const canvas = createCanvas(width, height);

const renderer = new Renderer(canvas, {contextType: 'webgl'});

const f = new Figure2D();
f.rect(0, 0, 512, 512);

const m = new Mesh2D(f, canvas);
m.setFill({color: '#ddd'});

const url = 'https://p0.ssl.qhimg.com/t01a72262146b87165f.png';

loadImage(url).then((image) => {
  const texture = renderer.createTexture(image);
  m.setTexture(texture);
  renderer.drawMeshes([m]);
  fs.writeFileSync('./snapshot/snap-spritejs.png', canvas.toBuffer());
});
```

![](https://p2.ssl.qhimg.com/t01c3b877430c190327.png)

#### with jsdom

You can use canvas2d and webgl as running in web browsers.

```js
const fs = require('fs');
const {Renderer, Figure2D, Mesh2D} = require('@mesh.js/core');

require('jsdom-global')();

const {mockDOM} = require('../lib');
mockDOM(window);

const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;

const renderer = new Renderer(canvas, {contextType: 'webgl'});

const f = new Figure2D();
f.rect(0, 0, 512, 512);

const m = new Mesh2D(f, canvas);
m.setFill({color: '#ddd'});

const url = 'https://p0.ssl.qhimg.com/t01a72262146b87165f.png';

renderer.loadTexture(url).then((texture) => {
  m.setTexture(texture);
  renderer.drawMeshes([m]);
  fs.writeFileSync('./snapshot/snap-meshjs2.png', canvas.toBuffer());
});
```