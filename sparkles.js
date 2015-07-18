/**
 * sparkles
 * Copyright © 2015 Fernando Fleury | MIT license | https://github.com/fernandofleury/sparkles
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('', [], factory);
    return;
  }
  if (typeof exports === 'object') {
    module.exports = factory();
  }
  root.Sparkles = factory();
})(this, function() {
  'use strict';

  var defaults = {
      color: '#FFFFFF',
      count: 30,
      overlap: 0,
      speed: 1,
      minSize: 4,
      maxSize: 7,
      direction: 'both'
    },
    Sparkles, datauri;

  /**
   * Sparkles constructor
   * @param {DOMNode} element The element to be transformed.
   * @param {Object} options
   */
  Sparkles = function(element, options) {
    var _self = this;

    if (!element) {
      return;
    }

    _self.element = element;

    /**
     * Defines instance listerners
     */
    _self._listeners = {};
    _self._listeners.start = function(e) {
      _self.start();
    };
    _self._listeners.stop = function(e) {
      _self.stop();
    };
    _self._listeners.resize = function(e) {
      _self._resize(_instance, true);
    };

    /**
     * Defines default instance object. This instance is used throught the Sparkles methods, preventing unnecessary exposure.
     */
    _self._instance = {};
    _self._instance.options = typeof options === 'object' ? _extend(defaults, options) : defaults;
    _self._instance.element = element;
    _self._instance.canvas = _createCanvas(_self._instance);
    _self._instance.sprite = _createSprite();
    _self._instance.particles = _createSparkles(_self._instance);
    _self._instance.context = _self._instance.canvas.getContext('2d');
    _self._instance.appendable = !(new RegExp(_self._instance.element.nodeName).test(/IMG|BR|HR|INPUT/));

    _setRawStyles(_self._instance);
    _insertNode(_self._instance);


    /**
     * Default event listeners for the instance.
     */
    element.addEventListener('mouseover', _self._listeners.start, false);
    element.addEventListener('mouseout', _self._listeners.stop, false);
    element.addEventListener('resize', _self._listeners.resize, false);
  };

  /**
   * Clears the current Sparkles instance
   */
  Sparkles.prototype.remove = function() {
    this.element.removeEventListener('mouseover', this._listeners.start, false);
    this.element.removeEventListener('mouseout', this._listeners.stop, false);
    this.element.removeEventListener('resize', this._listeners.resize, false);
    this.stop();
  };

  /**
   * Starts the effect manually.
   */
  Sparkles.prototype.start = function() {
    window.cancelAnimationFrame(this._instance.animate);
    this._instance.canvas.style.display = 'block';
    this._instance.fade = false;
    _resize(this._instance);
    _update(this._instance);
  };


  /**
   * Stops the effect manually.
   */
  Sparkles.prototype.stop = function() {
    this._instance.fade = true;
    this._instance.fadeCount = 100;
  };

  /**
   * Updates the current instance config
   * @param  {Object} options
   */
  Sparkles.prototype.update = function(options) {
    if (typeof options !== 'object') {
      return;
    }
    this._instance.options = _extend(this._instance.options, options);
    this._instance.particles = _createSparkles(this._instance);
  };

  function _resize(instance, rebuild) {
    instance.canvas.width = instance.element.offsetWidth;
    instance.canvas.height = instance.element.offsetHeight;

    if (instance.appendable) {
      instance.canvas.style.top = instance.element.offsetTop - instance.options.overlap;
      instance.canvas.style.left = instance.element.offsetleft - instance.options.overlap;
    }

    if (rebuild) {
      instance.particles = _createSparkles(instance);
    }
  }

  function _draw(instance) {
    instance.context.clearRect(0, 0, instance.canvas.width, instance.canvas.height);

    instance.particles.forEach(function(particle) {
      instance.context.save();
      instance.context.globalAlpha = particle.opacity;
      instance.context.drawImage(instance.sprite, particle.style, 0, 7, 7, particle.position.x, particle.position.y, particle.size, particle.size);

      if (instance.options.color) {
        instance.context.globalCompositeOperation = 'source-atop';
        instance.context.globalAlpha = 0.6;
        instance.context.fillStyle = particle.color;
        instance.context.fillRect(particle.position.x, particle.position.y, 7, 7);
      }

      instance.context.restore();
    });
  }

  function _update(instance) {
    var randX, randY, resizeParticle;

    instance.animate = window.requestAnimationFrame(function(timestamp) {
      timestamp = Math.floor(timestamp);

      instance.particles.forEach(function(particle) {
        randX = (Math.random() > Math.random() * 2);
        randY = (Math.random() < Math.random() * 5);

        if (randX) {
          particle.position.x += ((particle.delta.x * instance.options.speed) / 1500);
        }

        if (randY) {
          particle.position.y -= ((particle.delta.y * instance.options.speed) / 800);
        }

        if (particle.position.x > instance.canvas.width) {
          particle.position.x = -(instance.options.maxSize);
          resizeParticle = true;
        }

        if (particle.position.x < -(instance.options.maxSize)) {
          particle.position.x = instance.canvas.width;
          resizeParticle = true;
        }

        if (particle.position.y > instance.canvas.height) {
          particle.position.y = -(instance.options.maxSize);
          particle.position.x = Math.floor(Math.random() * instance.canvas.width);
          resizeParticle = true;
        }

        if (particle.position.y < -(instance.options.maxSize)) {
          particle.position.y = instance.canvas.height;
          particle.position.x = Math.floor(Math.random() * instance.canvas.width);
          resizeParticle = true;
        }

        if (resizeParticle) {
          particle.size = _randomizeParticleSize(instance.options);
          particle.opacity = 0.4;
        }

        if (instance.fade) {
          particle.opacity -= 0.035;
        }

        if (!instance.fade) {
          particle.opacity -= 0.005;
        }

        if (particle.opacity <= 0.15) {
          particle.opacity = instance.fade ? 0 : 1.2;
        }

        if (timestamp % Math.floor((Math.random() * 7) + 1) === 0) {
          particle.style = instance.sprite.coords[Math.floor(Math.random() * instance.sprite.coords.length)];
        }
      });


      _draw(instance);

      if (instance.fade) {
        instance.fadeCount -= 1;
        if (!instance.fadeCount) {
          window.cancelAnimationFrame(instance.animation);
          instance.canvas.style.display = 'none';
          return;
        }
        return _update(instance);
      }
      _update(instance);
    });
  }

  function _createCanvas(instance) {
    var canvas = document.createElement('canvas'),
      overlap = '-' + instance.options.overlap + 'px';

    canvas.classList.add('sparkles-canvas');

    canvas.width = instance.element.offsetWidth;
    canvas.height = instance.element.offsetHeight;

    canvas.style.position = 'absolute';
    canvas.style.top = overlap;
    canvas.style.left = overlap;
    canvas.style.display = 'none';
    canvas.style.pointerEvents = 'none';

    return canvas;
  }

  function _createSprite() {
    var sprite = new Image();
    sprite.src = datauri;
    sprite.coords = [0, 6, 13, 20];

    return sprite;
  }

  function _createSparkles(instance) {
    var temp = [],
      i = 0,
      yDelta,
      color;

    for (i; i < instance.options.count; i++) {
      color = _setCurrentColor(instance.options.color);

      yDelta = _setDelta(instance.options.direction);

      temp[i] = {
        color: color,
        delta: {
          x: (Math.floor(Math.random() * 1000) - 500),
          y: yDelta
        },
        position: {
          x: Math.floor(Math.random() * instance.canvas.width),
          y: Math.floor(Math.random() * instance.canvas.height)
        },
        opacity: Math.random(),
        size: _randomizeParticleSize(instance.options),
        style: instance.sprite.coords[Math.floor(Math.random() * instance.sprite.coords.length)],
      };
    }

    return temp;
  }

  function _setRawStyles(instance) {
    var props = window.getComputedStyle(instance.element);

    if (props.position === 'static') {
      instance.element.style.position = 'relative';
    }

    if (props.zIndex !== 'auto') {
      instance.canvas.style.zIndex = (props.zIndex - '') + 1;
    }
  }

  function _setDelta(direction) {
    if (direction === "down") {
      return Math.floor(Math.random() * 500) - 550;
    }

    if (direction === "up") {
      return Math.floor(Math.random() * 500) + 50;
    }

    return Math.floor(Math.random() * 1000) - 500;
  }

  function _setCurrentColor(color) {
    if (color === 'rainbow') {
      return _randomizeHexColor();
    }
    if (Array.isArray(color)) {
      return color[Math.floor(Math.random() * color.length)];
    }
    return color;
  }

  function _randomizeParticleSize(options) {
    return Math.floor(Math.random() * (options.maxSize - options.minSize + 1) + options.minSize);
  }

  function _randomizeHexColor() {
    return '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
  }

  function _insertNode(instance) {
    return instance.appendable ? instance.element.appendChild(instance.canvas) : document.insertBefore(instance.canvas, instance.element.nextElementSibling);
  }

  function _extend(base, to) {
    var newObj = {},
      prop;

    for (prop in base) {
      newObj[prop] = base[prop];
    }

    for (prop in to) {
      newObj[prop] = to[prop];
    }

    return newObj;
  }

  datauri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAHCAYAAAD5wDa1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDNFMzM5REEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDNFMzM5RUEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0M0UzMzlCQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0M0UzMzlDQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jzOsUQAAANhJREFUeNqsks0KhCAUhW/Sz6pFSc1AD9HL+OBFbdsVOKWLajH9EE7GFBEjOMxcUNHD8dxPBCEE/DKyLGMqraoqcd4j0ChpUmlBEGCFRBzH2dbj5JycJAn90CEpy1J2SK4apVSM4yiKonhePYwxMU2TaJrm8BpykpWmKQ3D8FbX9SOO4/tOhDEG0zRhGAZo2xaiKDLyPGeSyPM8sCxr868+WC/mvu9j13XBtm1ACME8z7AsC/R9r0fGOf+arOu6jUwS7l6tT/B+xo+aDFRo5BykHfav3/gSYAAtIdQ1IT0puAAAAABJRU5ErkJggg==';

  return Sparkles;

});
