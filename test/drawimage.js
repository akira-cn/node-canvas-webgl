require('jsdom-global')();
const {mockDOM} = require('../lib');

mockDOM(window);

const canvas = document.createElement('canvas');
const canvas2 = document.createElement('canvas');

const ctx = canvas.getContext('2d');

ctx.drawImage(canvas2, 0, 0);

const img = new Image();

ctx.drawImage(img, 0, 0);
