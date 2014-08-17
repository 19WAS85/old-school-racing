var RenderStatus = function (raceRender) {
  this.raceRender = raceRender;
  this.track = raceRender.race.track;
  this.segments = raceRender.race.track.segments
  this.baseCar = raceRender.race.baseCar;
  this.drawDistance = raceRender.config.drawDistance;
  this.segmentLength = this.track.segmentLength;
}

RenderStatus.prototype.update = function () {
  this.baseZ = this.track.getRelativeZ(this.baseCar.position.z);
  this.baseSegmentIndex = this.track.getSegmentIndexByZ(this.baseZ) - 2;
  this.baseSegment = this.track.getSegment(this.baseSegmentIndex);
  this.segmentPercent = (this.baseZ % this.segmentLength) / this.segmentLength;
  this.baseSegmentCurve = this.segmentPercent * this.baseSegment.curve;
  this.baseSegmentHill = this.segmentPercent * this.baseSegment.hill;
}

RenderStatus.prototype.getNextSegment = function (indexAhead) {
  return this.track.getSegment(this.baseSegmentIndex + indexAhead);
}

RenderStatus.prototype.getRelativeCarPosition = function (car, segment) {
  var xTopographycMod = this.topographycMod(car, segment.projection.curve);
  var yTopographycMod = this.topographycMod(car, segment.projection.hill);
  return {
    x: this.baseCar.position.x - car.position.x + xTopographycMod,
    y: car.position.y - this.baseCar.position.y + yTopographycMod,
    z: this.track.getRelativeZ(car.position.z - this.baseCar.position.z)
  };
}

RenderStatus.prototype.topographycMod = function (car, topographyc) {
  if (car == this.baseCar) return 0;
  var segmentPercent = (car.position.z % this.segmentLength) / this.segmentLength;
  return segmentPercent * (topographyc.end - topographyc.start) + topographyc.start;
}

RenderStatus.prototype.isVisible = function (z) {
  return z < this.drawDistance;
}

RenderStatus.prototype.getLoopedZ = function (segment) {
  return segment.index < this.baseSegmentIndex ? this.track.length : 0;
}

module.exports = RenderStatus;
