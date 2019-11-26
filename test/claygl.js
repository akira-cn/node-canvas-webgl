const fs = require('fs');
const {Renderer, GeometryBase, Shader, Material} = require('claygl');
const {createCanvas} = require('../lib');

const vsCode = `
attribute vec3 position: POSITION;
void main() {
    gl_Position = vec4(position, 1.0);
}
`;
const fsCode = `
void main() {
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}
`;

const canvas = createCanvas(400, 400);

const renderer = new Renderer({
  canvas,
});
// renderer.resize(400, 400);

const geometry = new GeometryBase();
geometry.createAttribute('position', 'float', 3);
// Add triangle vertices to position attribute.
geometry.attributes.position.fromArray([
  [-0.5, -0.5, 0],
  [0.5, -0.5, 0],
  [0, 0.5, 0],
]);

const material = new Material({
  shader: new Shader(vsCode, fsCode),
});
renderer.renderPass([{geometry, material}]);

fs.writeFileSync('./snapshot/snap-claygl.png', canvas.toBuffer());