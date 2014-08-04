var _ = require('underscore');
var PIXI = require('../engine/pixi');

var CarRender = function (raceRender, car, pseudo3d) {
  this.raceRender = raceRender;
  this.car = car;
  this.asset = car.image;
  this.texture = PIXI.Texture.fromImage(this.asset);
  this.sprite = new PIXI.Sprite(this.texture);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
}

CarRender.prototype.update = function (segment) {
  this.car.update(segment);
  var position = this.getRelativePosition();
  var point = this.raceRender.pseudo3d.projectPoint(position);
  this.sprite.position.x = point.x;
  this.sprite.position.y = point.y;
  this.sprite.scale.set(point.s);
}

CarRender.prototype.getRelativePosition = function () {
  var xNoise = this.createCarNoise();
  var yNoise = this.createCarNoise();
  var zNoise = this.createCarNoise();
  return {
    x: this.car.position.x - this.raceRender.race.player.position.x + xNoise,
    y: this.car.position.y - this.raceRender.race.player.position.y + yNoise,
    z: this.car.position.z - this.raceRender.race.player.position.z + zNoise
  };
}

CarRender.prototype.createCarNoise = function () {
  return this.car.dynamics.speed / 75 * (Math.random() * 2 - 1);
}

module.exports = CarRender;
