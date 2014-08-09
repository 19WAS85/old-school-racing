var _ = require('underscore');
var PIXI = require('../engine/pixi');

var RaceInfoRender = function (race) {
  this.race = race;
  this.sprites = this.createSprites();
}

RaceInfoRender.prototype.update = function () {
  var speed = this.getBaseCarSpeed();
  this.sprites.speed.setText(speed + ' km/h');
}

RaceInfoRender.prototype.createSprites = function () {
  return {
    speed: new PIXI.Text('')
  };
}

RaceInfoRender.prototype.getSprites = function () {
  return _(this.sprites).values();
}

RaceInfoRender.prototype.getBaseCarSpeed = function () {
  var pixelPerFrame = this.race.baseCar.dynamics.speed;
  var pixelPerSecond = (pixelPerFrame / 16) * 1000;
  var metersPerSecond = pixelPerSecond / 10;
  var kPerHour = metersPerSecond * 3.6;
  return Math.round(kPerHour);
}

module.exports = RaceInfoRender;
