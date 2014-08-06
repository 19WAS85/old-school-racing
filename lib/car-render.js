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
  this.car.dynamics.drag = this.getSegmentDrag(segment);
  this.car.update(segment);
  var position = this.getRelativePosition();
  var point = this.raceRender.pseudo3d.projectPoint(position);
  this.sprite.position.x = point.x;
  this.sprite.position.y = point.y;
  this.sprite.scale.set(point.s);
}

CarRender.prototype.getSegmentDrag = function (segment) {
  var factor = this.getOutOfTrackFactor(segment);
  return Math.min(Math.max(factor, 0), 1) / 100;
}

CarRender.prototype.getOutOfTrackFactor = function (segment) {
  var carBounds = this.getCarBounds();
  var firstBound = segment.projection.points[0].x - carBounds[0];
  var secondBound = carBounds[1] - segment.projection.points[1].x;
  if (firstBound > 0) return Math.abs(firstBound) / this.sprite.width;
  else if (secondBound > 0) return Math.abs(secondBound) / this.sprite.width;
  else return 0;
}

CarRender.prototype.getCarBounds = function (segment) {
  var x = this.sprite.position.x;
  var spriteHalfWidth = this.sprite.width / 2;
  return [x - spriteHalfWidth, x + spriteHalfWidth];
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
  var randomNoise = this.car.dynamics.speed / 75 * (Math.random() * 2 - 1);
  var carDragNoise = this.car.dynamics.drag * 250 + 1;
  return randomNoise * carDragNoise;
}

module.exports = CarRender;
