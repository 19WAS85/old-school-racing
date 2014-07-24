var Render = function (config, assets, updateCallback, onLoadComplete) {
  var self = this;
  this.config = config;
  this.assets = assets;
  this.updateCallback = updateCallback;
  this.onLoadComplete = onLoadComplete;
  this.loader = new PIXI.AssetLoader(this.assets);
  this.loader.onComplete = function () { self.load() };
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
  var self = this;
  this.updateCallback();
  this.renderer.render(this.stage);
  requestAnimFrame(function () { self.render() });
}
