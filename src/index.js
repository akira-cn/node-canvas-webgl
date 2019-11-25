import {
  Canvas,
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
  createCanvas,
  createImageData,
  loadImage,
  backends,
  version,
  cairoVersion,
  jpegVersion,
  gifVersion,
  freetypeVersion,
} from 'canvas';

import createGLContext from 'gl';
const WebGLRenderingContext = createGLContext(1, 1).constructor;

const _getContext = Canvas.prototype.getContext;
Canvas.prototype.getContext = function (type, options) {
  if(this.__contextType__ && this.__contextType__ !== type) return null;
  if(this.__gl__) return this.__gl__;
  this.__contextType__ = type;
  if(type === 'webgl' || type === 'webgl2') {
    const {width, height} = this;
    this.__ctx__ = _getContext.call(this, '2d', options);
    const ctx = createGLContext(width, height, options);
    const _tetImage2D = ctx.texImage2D;
    ctx.texImage2D = function (...args) {
      const pixels = args[args.length - 1];
      if(pixels instanceof Image) {
        const canvas = createCanvas(pixels.width, pixels.height);
        canvas.getContext('2d').drawImage(pixels, 0, 0);
        args[args.length - 1] = canvas;
      }
      return _tetImage2D.apply(this, args);
    };
    this.__gl__ = ctx;
    return this.__gl__;
  }
  return _getContext.call(this, type, options);
};

const _toBuffer = Canvas.prototype.toBuffer;
Canvas.prototype.toBuffer = function (...args) {
  const gl = this.__gl__;
  if(gl) {
    const {width, height} = this;
    const ctx = this.__ctx__;

    const data = ctx.getImageData(0, 0, width, height);

    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    for(let i = 0; i < height; i++) {
      for(let j = 0; j < width; j++) {
        const col = j;
        const row = height - i - 1;
        for(let k = 0; k < 4; k++) {
          const idx = 4 * (row * width + col) + k;
          const idx2 = 4 * (i * width + col) + k;
          data.data[idx] = pixels[idx2];
        }
      }
    }

    ctx.putImageData(data, 0, 0);
  }
  return _toBuffer.apply(this, args);
};

// console.log(WebGLRenderingContext.prototype.texImage2D);

export {
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
};