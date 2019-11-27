const {
  Context2d,
  CanvasRenderingContext2D,
  CanvasGradient,
  CanvasPattern,
  Image,
  ImageData,
  PNGStream,
  PDFStream,
  JPEGStream,
  DOMMatrix,
  DOMPoint,
  registerFont,
  parseFont,
  createImageData,
  loadImage,
  backends,
  version,
  cairoVersion,
  jpegVersion,
  gifVersion,
  freetypeVersion,
} = require('canvas');

const {WebGLRenderingContext} = require('gl/src/javascript/webgl-rendering-context');

const mockDOM = require('./mock');

const Canvas = require('./canvas');

function createCanvas(width, height, type) {
  return new Canvas(width, height, type);
}

module.exports = {
  Canvas,
  Context2d,
  CanvasRenderingContext2D,
  WebGLRenderingContext,
  CanvasGradient,
  CanvasPattern,
  Image,
  ImageData,
  PNGStream,
  PDFStream,
  JPEGStream,
  DOMMatrix,
  DOMPoint,
  registerFont,
  parseFont,
  createCanvas,
  createImageData,
  loadImage,
  backends,
  version,
  cairoVersion,
  jpegVersion,
  gifVersion,
  freetypeVersion,
  mockDOM,
};