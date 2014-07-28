var PIXI = require('../engine/pixi-1.6.0');

var Render = function (config, assets, onLoadComplete, updateCallback) {
  this.config = config;
  this.assets = assets;
  this.updateCallback = updateCallback;
  this.onLoadComplete = onLoadComplete;
  this.loader = new PIXI.AssetLoader(this.assets);
  this.loader.onComplete = this.load.bind(this);
  this.loader.load();
}

Render.prototype.load = function () {
  this.stage = new PIXI.Stage(0xFDFDFD);
  this.renderer = new PIXI.autoDetectRenderer(
    this.config.width, this.config.height
  );
  document.body.appendChild(this.renderer.view);
  if (this.onLoadComplete) this.onLoadComplete();
  this.render();
}

Render.prototype.render = function () {
  this.updateCallback();
  this.renderer.render(this.stage);
  requestAnimFrame(this.render.bind(this));
}

module.exports = Render;
