var _ = require('underscore');
var PIXI = require('../engine/pixi');
var Render = require('./render');
var RenderConfig = require('./render-config');
var Pseudo3D = require('./pseudo3d');
var TrackRender = require('./track-render');
var CarRender = require('./car-render');
var RaceInfoRender = require('./race-info-render');

var RaceRender = function (race, config) {
  this.race = race;
  this.config = new RenderConfig();
  this.pseudo3d = new Pseudo3D(this.config);
  this.trackRender = new TrackRender(this, this.race.track);
  this.carsRenders = this.createCarsRenders();
  this.infoRender = new RaceInfoRender(this.race);
  this.assets = this.getAssets();
  this.render = new Render(
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
  return _(this.carsRenders).map(function (c) { return c.asset });
}

RaceRender.prototype.registerObjects = function () {
  this.render.stage.addChild(this.trackRender.sprite);
  _(this.carsRenders).each(function (carRender) {
    this.render.stage.addChild(carRender.sprite);
  }.bind(this));
  _(this.infoRender.sprites).each(function (sprite) {
    this.render.stage.addChild(sprite);
  }.bind(this));
}

RaceRender.prototype.update = function () {
  this.trackRender.update();
  _(this.carsRenders).each(function (carRender) {
    var segment = this.race.track.getSegmentByZ(carRender.car.position.z);
    carRender.update(segment);
  }.bind(this));
  this.infoRender.update();
}

module.exports = RaceRender;
