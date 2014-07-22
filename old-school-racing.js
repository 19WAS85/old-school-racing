// --- CAR -----------------
var Car = function (image) {
  this.image = image;
  this.position = { x: 0, y: 0, z: 0 };
}


// --- TRACK --------------------------
var Track = function (name, segments) {
  this.name = name;
  this.segments = segments;
}


// --- TRACK BUILDER ---------------
var TrackBuilder = function (name) {
  this.name = name;
  this.segments = [];
}

TrackBuilder.prototype.straight = function (length, width, color) {
  // todo: use underscore here
  for (var i = 0; i < length; i++) {
    var index = this.segments.length;
    this.segments.push([index, 0, width, color]);
  }
}

TrackBuilder.prototype.create = function () {
  return new Track(this.name, this.segments);
}


// --- RACE -----------------------
var Race = function (track, cars) {
  this.track = track;
  this.cars = cars;
}


// --- CAMERA ------------
var Camera = function () {
  this.height = 50;
  this.distance = this.height * 1.3;
  this.fieldOfView = Math.tan(45);
}


// --- RENDER ----------------------------------------------------------
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
  this.stage = new PIXI.Stage(0xDDDDDD);
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


// --- RENDER CONFIG ------------------
var DefaultRenderConfig = function () {
  this.scale = 0.5;
  this.width = 1920 * this.scale;
  this.height = 1080 * this.scale;
  this.halfWidth = this.width / 2;
  this.halfHeight = this.height / 2;
}

// --- PSEUDO3D --------------------------
var Pseudo3D = function (config, camera) {
  this.config = config;
  this.camera = camera;
  this.scaleCoeficient = 200;
}

Pseudo3D.prototype.projectPoint = function(point) {
  var x = point.x * this.config.scale;
  var y = (point.y + this.camera.height) * this.config.scale;
  var z = (point.z + this.camera.distance) * this.config.scale;
  var xScale = this.config.width / this.camera.fieldOfView;
  var yScale = this.config.height / this.camera.fieldOfView;
  var scaleCoeficient = this.config.scale * this.scaleCoeficient;
  return {
    x: x * xScale / z + this.config.halfWidth,
    y: y * yScale / z + this.config.halfHeight,
    s: (1 / (point.z + this.camera.distance)) * scaleCoeficient
  };
}


// --- CAR RENDER ------------------------
var CarRender = function (car, pseudo3d) {
  this.car = car;
  this.pseudo3d = pseudo3d;
  this.asset = car.image;
  this.texture = PIXI.Texture.fromImage(this.asset);
  this.sprite = new PIXI.Sprite(this.texture);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
}

CarRender.prototype.update = function () {
  var point = this.pseudo3d.projectPoint(this.car.position);
  this.sprite.position.x = point.x;
  this.sprite.position.y = point.y;
  this.sprite.scale.set(point.s);
}


// --- RACE RENDER -----------------------
var RaceRender = function (race, config) {
  var self = this;
  this.race = race;
  this.config = config || new DefaultRenderConfig();
  this.camera = new Camera();
  this.pseudo3d = new Pseudo3D(this.config, this.camera);
  this.objects = this.createRenderObjects();
  this.assets = this.getAssets();
  this.render = new Render(
    this.config,
    this.assets,
    function () { self.update() },
    function () { self.registerObjects() }
  );
}

RaceRender.prototype.update = function () {
  _(this.objects).each(function (o) { o.update() });
}

RaceRender.prototype.createRenderObjects = function () {
  var pseudo3d = this.pseudo3d;
  return _(this.race.cars).map(function (car) {
    return new CarRender(car, pseudo3d);
  });
}

RaceRender.prototype.getAssets = function () {
  return _(this.objects).map(function (o) { return o.asset });
}

RaceRender.prototype.registerObjects = function () {
  var stage = this.render.stage;
  _(this.objects).each(function (o) { stage.addChild(o.sprite) });
}
