var _ = require('underscore');
var PIXI = require('../engine/pixi-1.6.0');
var Render = require('./render');
var RenderConfig = require('./render-config');
var Pseudo3D = require('./pseudo3d');
var TrackRender = require('./track-render');
var CarRender = require('./car-render');

var RaceRender = function (race, config) {
  this.race = race;
  this.config = new RenderConfig();
  this.pseudo3d = new Pseudo3D(this.config);
  this.trackRender = new TrackRender(this, this.race.track);
  this.carsRenders = this.createCarsRenders();
  this.assets = this.getAssets();
  this.render = new Render(
    this.config,
    this.assets,
    this.registerObjects.bind(this),
    this.update.bind(this)
  );
}

RaceRender.prototype.createCarsRenders = function () {
  return _(this.race.cars).map(function (c) {
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
}

RaceRender.prototype.update = function () {
  _(this.carsRenders).each(function (c) { c.update() });
  this.trackRender.update();
}

module.exports = RaceRender;
