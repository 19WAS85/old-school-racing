var RenderStatus = function (raceRender) {
  this.raceRender = raceRender;
  this.track = raceRender.race.track;
  this.segments = raceRender.race.track.segments
  this.baseCar = raceRender.race.baseCar;
  this.segmentLength = this.track.segmentLength;
}

RenderStatus.prototype.update = function () {
  this.baseZ = this.track.getRelativeZ(this.baseCar.position.z);
  this.baseSegmentIndex = this.track.getSegmentIndexByZ(this.baseZ) - 1;
  this.baseSegment = this.track.getSegment(this.baseSegmentIndex);
  this.segmentPercent = (this.baseZ % this.segmentLength) / this.segmentLength;
  this.baseSegmentCurve = this.segmentPercent * this.baseSegment.curve;
  this.baseSegmentHill = this.segmentPercent * this.baseSegment.hill;
}

RenderStatus.prototype.getNextSegment = function(indexAhead) {
  return this.track.getSegment(this.baseSegmentIndex + indexAhead);
}

module.exports = RenderStatus;
