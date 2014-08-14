var _ = require('underscore');
var PIXI = require('../engine/pixi');
var ScreenRender = require('./screen-render');
var RenderConfig = require('./render-config');
var Pseudo3D = require('./pseudo3d');
var TrackRender = require('./track-render');
var CarRender = require('./car-render');
var RaceInfoRender = require('./race-info-render');
var RenderStatus = require('./render-status');

var RaceRender = function (race, config) {
  this.race = race;
  this.config = new RenderConfig();
  this.pseudo3d = new Pseudo3D(this.config);
  this.trackRender = new TrackRender(this, this.race.track);
  this.carsRenders = this.createCarsRenders();
  this.infoRender = new RaceInfoRender(this.race);
  this.assets = this.getAssets();
  this.status = new RenderStatus(this);
  this.render = new ScreenRender(
    this.config,
    this.assets,
    this.registerObjects.bind(this),
    this.update.bind(this)
  );
}

RaceRender.prototype.createCarsRenders = function () {
  return _(this.race.cars).map(function (car) {
    return new CarRender(this, car);
  }.bind(this));
}

RaceRender.prototype.getAssets = function () {
  var cars = _(this.carsRenders).map(function (c) { return c.asset });
  var objects = _(this.race.track.objects).map(function (o) { return o.image });
  return cars.concat(objects);
}

RaceRender.prototype.registerObjects = function () {
  this.render.stage.addChild(this.trackRender.sprite);
  _(this.carsRenders).each(function (carRender) {
    this.render.stage.addChild(carRender.sprite);
  }.bind(this));
  _(this.infoRender.sprites).each(function (sprite) {
    this.render.stage.addChild(sprite);
  }.bind(this));
  _(this.trackRender.objects).each(function (object) {
    this.render.stage.addChild(object.sprite);
  }.bind(this));
}

RaceRender.prototype.update = function (status) {
  this.status.update();
  this.trackRender.update(this.status);
  _(this.carsRenders).each(function (carRender) {
    var segment = this.race.track.getSegmentByZ(carRender.car.position.z);
    carRender.update(this.status, segment);
  }.bind(this));
  this.infoRender.update(this.status);
}

module.exports = RaceRender;
