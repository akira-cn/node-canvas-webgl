const fs = require('fs');
const {Renderer, Figure2D, Mesh2D} = require('@mesh.js/core');
const {createCanvas, loadImage} = require('../lib');

const width = 512,
  height = 512;

const canvas = createCanvas(width, height);

const f = new Figure2D();
f.rect(0, 0, 100, 100);

const m = new Mesh2D(f, canvas);
m.setFill({color: 'red'});

const renderer = new Renderer(canvas, {contextType: 'webgl'});
// const gl = renderer.glRenderer.gl;

const url = 'https://p0.ssl.qhimg.com/t01a72262146b87165f.png';

loadImage(url).then((image) => {
  const texture = renderer.createTexture(image);
  m.setTexture(texture);
  renderer.drawMeshes([m]);
  fs.writeFileSync('snap.png', canvas.toBuffer());
});
