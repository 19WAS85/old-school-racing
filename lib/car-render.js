var PIXI = require('../engine/pixi');

var CarRender = function (raceRender, car) {
  this.raceRender = raceRender;
  this.car = car;
  this.asset = car.image;
  this.texture = PIXI.Texture.fromImage(this.asset);
  this.sprite = new PIXI.Sprite(this.texture);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.baseCar = this.raceRender.race.baseCar;
  this.track = this.raceRender.race.track;
}

CarRender.prototype.update = function (segment) {
  this.car.dynamics.drag = this.getSegmentDrag(segment);
  var position = this.getRelativePosition(segment);
  var point = this.raceRender.pseudo3d.projectPoint(position);
  this.sprite.position.x = point.x;
  this.sprite.position.y = point.y;
  this.sprite.scale.set(point.s);
  this.sprite.z = this.track.getRelativeZ(this.car.position.z);
  this.car.update(segment);
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

CarRender.prototype.getCarBounds = function () {
  var x = this.sprite.position.x;
  var spriteHalfWidth = this.sprite.width / 2;
  return [x - spriteHalfWidth, x + spriteHalfWidth];
}

CarRender.prototype.getRelativePosition = function (segment) {
  var xMod = this.createTopographycMod(segment.projection.startCurve, segment.projection.endCurve) + this.createCarNoise();
  var yMod = this.createTopographycMod(segment.projection.startHill, segment.projection.endHill) + this.createCarNoise();
  var carZ = this.car.position.z - this.baseCar.position.z;
  var relativeZ = this.track.getRelativeZ(carZ);
  return {
    x: this.baseCar.position.x - this.car.position.x + xMod,
    y: this.car.position.y - this.baseCar.position.y + yMod,
    z: relativeZ + this.createCarNoise()
  };
}

CarRender.prototype.createTopographycMod = function (start, end) {
  if (this.isBaseCar()) return 0;
  var segmentLength = this.track.segmentLength;
  var segmentPercent = (this.car.position.z % segmentLength) / segmentLength;
  return segmentPercent * (end - start) + start;
}

CarRender.prototype.isBaseCar = function () {
  return this.car == this.baseCar;
}

CarRender.prototype.createCarNoise = function () {
  var randomNoise = this.car.dynamics.speed / 80 * (Math.random() * 2 - 1);
  var carDragNoise = this.car.dynamics.drag * 250 + 1;
  return randomNoise * carDragNoise;
}

module.exports = CarRender;
