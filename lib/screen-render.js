var _ = require('underscore');
var PIXI = require('../engine/pixi');

var ScreenRender = function (config, assets, onLoadComplete, updateCallback) {
  this.config = config;
  this.assets = assets;
  this.updateCallback = updateCallback;
  this.onLoadComplete = onLoadComplete;
  this.loader = new PIXI.AssetLoader(this.assets);
  this.loader.onComplete = this.load.bind(this);
  this.loader.load();
}

ScreenRender.prototype.load = function () {
  this.stage = new PIXI.Stage(0xDDEEFF);
  this.renderer = new PIXI.autoDetectRenderer(
    this.config.width, this.config.height
  );
  document.body.appendChild(this.renderer.view);
  if (this.onLoadComplete) this.onLoadComplete();
  this.render();
}

ScreenRender.prototype.render = function () {
  this.updateCallback();
  this.stage.children = this.getChildrenSortByDepth();
  this.renderer.render(this.stage);
  requestAnimFrame(this.render.bind(this));
}

ScreenRender.prototype.getChildrenSortByDepth = function () {
  return _(this.stage.children).sortBy(function (a) { return -a.z });
}

module.exports = ScreenRender;
