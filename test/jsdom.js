const fs = require('fs');
const {Renderer, Figure2D, Mesh2D} = require('@mesh.js/core');
require('jsdom-global')();
const {mockDOM} = require('../lib');

mockDOM(window, {mockImage: true});

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