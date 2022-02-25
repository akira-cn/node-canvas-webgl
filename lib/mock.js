const {Image, CanvasRenderingContext2D} = require('canvas');
const {WebGLRenderingContext} = require('gl/src/javascript/webgl-rendering-context');
const Canvas = require('./canvas');

module.exports = function mockDOM(window = global, {mockImage = true} = {}) {
  const HTMLCanvasElement = window.HTMLCanvasElement;
  const HTMLImageElement = window.HTMLImageElement;

  window.CanvasRenderingContext2D = CanvasRenderingContext2D;
  window.WebGLRenderingContext = WebGLRenderingContext;

  if(global.window === window && global.document && global.document === window.document) {
    global.CanvasRenderingContext2D = CanvasRenderingContext2D;
    global.WebGLRenderingContext = WebGLRenderingContext;
  }

  const _drawImage = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (img, ...args) {
    if(img instanceof HTMLCanvasElement) {
      img = img._getCanvas();
    } else if(mockImage && img instanceof HTMLImageElement) {
      if(!img._loaded) return;
      img = img._image;
    }
    return _drawImage.call(this, img, ...args);
  };

  if(typeof HTMLCanvasElement === 'function') {
    HTMLCanvasElement.prototype._getCanvas = function () {
      if(!this._canvas) {
        this._canvas = new Canvas(this.width, this.height);
      }
      return this._canvas;
    };

    HTMLCanvasElement.prototype.getContext = function (contextId, options) {
      const canvas = this._getCanvas();
      if(!this._context) {
        this._context = canvas.getContext(contextId, options) || null;
        this._context.canvas = this;
      }
      return this._context;
    };

    HTMLCanvasElement.prototype.toDataURL = function (...args) {
      const canvas = this._getCanvas();
      return canvas.toDataURL(...args);
    };

    HTMLCanvasElement.prototype.toBuffer = function (...args) {
      const canvas = this._getCanvas();
      return canvas.toBuffer(...args);
    };

    Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
      get() {
        const parsed = parseInt(this.getAttributeNS(null, 'width'), 10);
        return Number.isNaN(parsed) || parsed < 0 || parsed > 2147483647 ? 300 : parsed;
      },
      set(value) {
        value = value > 2147483647 ? 300 : value;
        this.setAttributeNS(null, 'width', String(value));
        const canvas = this._getCanvas();
        canvas.width = value;
      },
    });

    Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
      get() {
        const parsed = parseInt(this.getAttributeNS(null, 'height'), 10);
        return Number.isNaN(parsed) || parsed < 0 || parsed > 2147483647 ? 150 : parsed;
      },
      set(value) {
        value = value > 2147483647 ? 150 : value;
        this.setAttributeNS(null, 'height', String(value));
        const canvas = this._getCanvas();
        canvas.height = value;
      },
    });

    if(mockImage) {
      const __src__ = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, '__src__');
      if(!__src__) {
        const src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        Object.defineProperty(HTMLImageElement.prototype, '__src__', src);

        Object.defineProperty(HTMLImageElement.prototype, 'src', {
          get() {
            return this.__src__;
          },
          set(value) {
            if(!this._image) {
              this._image = new Image();
              this._image.onload = () => {
                this._loaded = true;
                this.dispatchEvent(new window.Event('load'));
              };
            }
            this.__src__ = value;
            this._image.src = this.__src__;
          },
        });

        Object.defineProperty(HTMLImageElement.prototype, 'width', {
          get() {
            if(this.hasAttributeNS(null, 'width')) {
              const parsed = parseInt(this.getAttributeNS(null, 'width'), 10);
              return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
            }
            return this._image ? this._image.width : 0;
          },
          set(value) {
            this.setAttributeNS(null, 'width', String(value));
          },
        });

        Object.defineProperty(HTMLImageElement.prototype, 'height', {
          get() {
            if(this.hasAttributeNS(null, 'height')) {
              const parsed = parseInt(this.getAttributeNS(null, 'height'), 10);
              return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
            }
            return this._image ? this._image.height : 0;
          },
          set(value) {
            this.setAttributeNS(null, 'height', String(value));
          },
        });
      }
    }

    return HTMLCanvasElement;
  }

  throw new TypeError('HTMLCanvasElement is not defined.');
};