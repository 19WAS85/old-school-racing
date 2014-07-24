// --- CAR -----------------
var Car = function (image) {
  this.image = image;
  this.position = { x: 0, y: 0, z: 0 };
}


// --- TRACK --------------------------
var Track = function (name, segments) {
  this.name = name;
  this.segments = segments || [];
  this.defaultSegmentOptions = {
    curve: 0, width: 200, color: 0xAAAAAA
  }
}

Track.prototype.addSegments = function (length, parameters) {
  var segments = this.segments;
  parameters = _(this.defaultSegmentOptions).extend(parameters);
  _(length).times(function () {
    var thisParameters = _({ index: segments.length }).extend(parameters);
    segments.push(thisParameters);
  });
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


// --- RENDER CONFIG -----------
var RenderConfig = function () {
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
  this.segmentLength = 20;
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
var CarRender = function (raceRender, car, pseudo3d) {
  this.raceRender = raceRender;
  this.car = car;
  this.asset = car.image;
  this.texture = PIXI.Texture.fromImage(this.asset);
  this.sprite = new PIXI.Sprite(this.texture);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
}

CarRender.prototype.update = function () {
  var point = this.raceRender.pseudo3d.projectPoint(this.car.position);
  this.sprite.position.x = point.x;
  this.sprite.position.y = point.y;
  this.sprite.scale.set(point.s);
}


// --- TRACK RENDER -------------------------
var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.sprite = new PIXI.Graphics();
}

TrackRender.prototype.update = function () {
  this.sprite.clear();
  var lastPoint = null;
  _(this.track.segments).each(function (segment) {
    var point = this.projectSegmentPoint(segment);
    if (lastPoint) this.drawSegment(point, lastPoint);
    lastPoint = point;
  }.bind(this));
}

TrackRender.prototype.drawSegment = function (point, lastPoint) {
  this.sprite.beginFill(point.c);
  this.sprite.moveTo(point.x - point.w, point.y);
  this.sprite.lineTo(point.x + point.w, point.y);
  this.sprite.lineTo(lastPoint.x + lastPoint.w, lastPoint.y);
  this.sprite.lineTo(lastPoint.x - lastPoint.w, lastPoint.y);
  this.sprite.endFill();
}

TrackRender.prototype.projectSegmentPoint = function(segment) {
  var length = this.raceRender.pseudo3d.segmentLength;
  var halfWidth = this.raceRender.render.config.halfWidth;
  var position = { x: 0, y: 0, z: segment.index * length };
  var point = this.raceRender.pseudo3d.projectPoint(position);
  point.w = segment.width * point.s;
  point.c = segment.index % 2 == 0 ? segment.color : segment.color - 0x101010;
  return point;
}

TrackRender.prototype.calculateSegmentPosition = function(segment) {
}


// --- RACE RENDER -----------------------
var RaceRender = function (race, config) {
  var self = this;
  this.race = race;
  this.config = new RenderConfig();
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
  var self = this;
  var objects = [new TrackRender(self, this.race.track)];
  return objects.concat(_(this.race.cars).map(function (car) {
    return new CarRender(self, car);
  }));
}

RaceRender.prototype.getAssets = function () {
  var assets = _(this.objects).map(function (object) {
    if (object.asset) return object.asset;
  });
  return _(assets).compact();
}

RaceRender.prototype.registerObjects = function () {
  var stage = this.render.stage;
  _(this.objects).each(function (object) {
    if (object.sprite) stage.addChild(object.sprite);
  });
}
