var PIXI = require('../engine/pixi');

var CarRender = function (raceRender, car) {
  this.raceRender = raceRender;
  this.car = car;
  this.asset = car.image;
  this.texture = PIXI.Texture.fromImage(this.asset);
  this.sprite = new PIXI.Sprite(this.texture);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
}

CarRender.prototype.update = function (status, segment) {
  this.car.dynamics.drag = this.getSegmentDrag(segment);
  var position = status.getRelativeCarPosition(this.car, segment);
  var noisePosition = this.addNoiseToPosition(position);
  var point = this.raceRender.pseudo3d.projectPoint(noisePosition);
  this.sprite.position.x = point.x;
  this.sprite.position.y = point.y;
  this.sprite.scale.set(point.s);
  this.sprite.z = status.track.getRelativeZ(this.car.position.z);
  this.car.update(segment);
}

CarRender.prototype.addNoiseToPosition = function (position) {
  position.x += this.createCarNoise();
  position.y += this.createCarNoise();
  position.z += this.createCarNoise();
  return position;
}

CarRender.prototype.getSegmentDrag = function (segment) {
  var factor = this.getOutOfTrackFactor(segment);
  return Math.min(Math.max(factor, 0), 1) / 100;
}

CarRender.prototype.getOutOfTrackFactor = function (segment) {
  var carBounds = this.getCarBounds();
  var firstBound = segment.projection.left - carBounds[0];
  var secondBound = carBounds[1] - segment.projection.right;
  if (firstBound > 0) return Math.abs(firstBound) / this.sprite.width;
  else if (secondBound > 0) return Math.abs(secondBound) / this.sprite.width;
  else return 0;
}

CarRender.prototype.getCarBounds = function () {
  var x = this.sprite.position.x;
  var spriteHalfWidth = this.sprite.width / 2;
  return [x - spriteHalfWidth, x + spriteHalfWidth];
}

CarRender.prototype.createCarNoise = function () {
  var randomNoise = this.car.dynamics.speed / 80 * (Math.random() * 2 - 1);
  var carDragNoise = this.car.dynamics.drag * 250 + 1;
  return randomNoise * carDragNoise;
}

module.exports = CarRender;
