"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Canvas", {
  enumerable: true,
  get: function get() {
    return _canvas.Canvas;
  }
});
Object.defineProperty(exports, "Context2d", {
  enumerable: true,
  get: function get() {
    return _canvas.Context2d;
  }
});
Object.defineProperty(exports, "CanvasRenderingContext2D", {
  enumerable: true,
  get: function get() {
    return _canvas.CanvasRenderingContext2D;
  }
});
Object.defineProperty(exports, "CanvasGradient", {
  enumerable: true,
  get: function get() {
    return _canvas.CanvasGradient;
  }
});
Object.defineProperty(exports, "CanvasPattern", {
  enumerable: true,
  get: function get() {
    return _canvas.CanvasPattern;
  }
});
Object.defineProperty(exports, "Image", {
  enumerable: true,
  get: function get() {
    return _canvas.Image;
  }
});
Object.defineProperty(exports, "ImageData", {
  enumerable: true,
  get: function get() {
    return _canvas.ImageData;
  }
});
Object.defineProperty(exports, "PNGStream", {
  enumerable: true,
  get: function get() {
    return _canvas.PNGStream;
  }
});
Object.defineProperty(exports, "PDFStream", {
  enumerable: true,
  get: function get() {
    return _canvas.PDFStream;
  }
});
Object.defineProperty(exports, "JPEGStream", {
  enumerable: true,
  get: function get() {
    return _canvas.JPEGStream;
  }
});
Object.defineProperty(exports, "DOMMatrix", {
  enumerable: true,
  get: function get() {
    return _canvas.DOMMatrix;
  }
});
Object.defineProperty(exports, "DOMPoint", {
  enumerable: true,
  get: function get() {
    return _canvas.DOMPoint;
  }
});
Object.defineProperty(exports, "registerFont", {
  enumerable: true,
  get: function get() {
    return _canvas.registerFont;
  }
});
Object.defineProperty(exports, "parseFont", {
  enumerable: true,
  get: function get() {
    return _canvas.parseFont;
  }
});
Object.defineProperty(exports, "createCanvas", {
  enumerable: true,
  get: function get() {
    return _canvas.createCanvas;
  }
});
Object.defineProperty(exports, "createImageData", {
  enumerable: true,
  get: function get() {
    return _canvas.createImageData;
  }
});
Object.defineProperty(exports, "loadImage", {
  enumerable: true,
  get: function get() {
    return _canvas.loadImage;
  }
});
Object.defineProperty(exports, "backends", {
  enumerable: true,
  get: function get() {
    return _canvas.backends;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function get() {
    return _canvas.version;
  }
});
Object.defineProperty(exports, "cairoVersion", {
  enumerable: true,
  get: function get() {
    return _canvas.cairoVersion;
  }
});
Object.defineProperty(exports, "jpegVersion", {
  enumerable: true,
  get: function get() {
    return _canvas.jpegVersion;
  }
});
Object.defineProperty(exports, "gifVersion", {
  enumerable: true,
  get: function get() {
    return _canvas.gifVersion;
  }
});
Object.defineProperty(exports, "freetypeVersion", {
  enumerable: true,
  get: function get() {
    return _canvas.freetypeVersion;
  }
});
exports.WebGLRenderingContext = void 0;

var _canvas = require("canvas");

var _gl = _interopRequireDefault(require("gl"));

var WebGLRenderingContext = (0, _gl["default"])(1, 1).constructor;
exports.WebGLRenderingContext = WebGLRenderingContext;
var _getContext = _canvas.Canvas.prototype.getContext;

_canvas.Canvas.prototype.getContext = function (type, options) {
  if (this.__contextType__ && this.__contextType__ !== type) return null;
  if (this.__gl__) return this.__gl__;
  this.__contextType__ = type;

  if (type === 'webgl' || type === 'webgl2') {
    var width = this.width,
        height = this.height;
    this.__ctx__ = _getContext.call(this, '2d', options);
    var ctx = (0, _gl["default"])(width, height, options);
    var _tetImage2D = ctx.texImage2D;

    ctx.texImage2D = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var pixels = args[args.length - 1];

      if (pixels instanceof _canvas.Image) {
        var canvas = (0, _canvas.createCanvas)(pixels.width, pixels.height);
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

var _toBuffer = _canvas.Canvas.prototype.toBuffer;

_canvas.Canvas.prototype.toBuffer = function () {
  var gl = this.__gl__;

  if (gl) {
    var width = this.width,
        height = this.height;
    var ctx = this.__ctx__;
    var data = ctx.getImageData(0, 0, width, height);
    var pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        var col = j;
        var row = height - i - 1;

        for (var k = 0; k < 4; k++) {
          var idx = 4 * (row * width + col) + k;
          var idx2 = 4 * (i * width + col) + k;
          data.data[idx] = pixels[idx2];
        }
      }
    }

    ctx.putImageData(data, 0, 0);
  }

  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return _toBuffer.apply(this, args);
}; // console.log(WebGLRenderingContext.prototype.texImage2D);