const {Image} = require('canvas');
const Canvas = require('./canvas');

module.exports = function mockDOM(window = global) {
  const HTMLCanvasElement = window.HTMLCanvasElement;
  if(typeof HTMLCanvasElement === 'function') {
    HTMLCanvasElement.prototype._getCanvas = function () {
      if(!this._canvas) {
        this._canvas = new Canvas(this.width, this.height);
      }
      return this._canvas;
    };

    HTMLCanvasElement.prototype.getContext = function (contextId) {
      const canvas = this._getCanvas();
      if(!this._context) {
        this._context = canvas.getContext(contextId) || null;
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

    const HTMLImageElement = window.HTMLImageElement;
    const src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(HTMLImageElement.prototype, '_src', src);

    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      get() {
        return this._src;
      },
      set(value) {
        if(!this._image) {
          this._image = new Image();
          this._image.onload = () => {
            this.dispatchEvent(new window.Event('load'));
          };
        }
        this._src = value;
        this._image.src = this._src;
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

    return HTMLCanvasElement;
  }

  throw new TypeError('HTMLCanvasElement is not defined.');
};