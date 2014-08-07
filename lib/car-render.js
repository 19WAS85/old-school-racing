var _ = require('underscore');
var PIXI = require('../engine/pixi');

var CarRender = function (raceRender, car) {
  this.raceRender = raceRender;
  this.car = car;
  this.asset = car.image;
  this.texture = PIXI.Texture.fromImage(this.asset);
  this.sprite = new PIXI.Sprite(this.texture);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.player = this.raceRender.race.player;
}

CarRender.prototype.update = function (segment) {
  this.car.dynamics.drag = this.getSegmentDrag(segment);
  this.car.update(segment);
  var position = this.getRelativePosition();
  var point = this.raceRender.pseudo3d.projectPoint(position);
  this.sprite.position.x = point.x;
  this.sprite.position.y = point.y;
  this.sprite.scale.set(point.s);
  this.sprite.z = this.car.position.z;
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
  return {
    x: this.player.position.x - this.car.position.x + this.createCarNoise(),
    y: this.car.position.y - this.player.position.y + this.createCarNoise(),
    z: this.car.position.z - this.player.position.z + this.createCarNoise()
  };
}

CarRender.prototype.createCarNoise = function () {
  var randomNoise = this.car.dynamics.speed / 75 * (Math.random() * 2 - 1);
  var carDragNoise = this.car.dynamics.drag * 250 + 1;
  return randomNoise * carDragNoise;
}

module.exports = CarRender;
