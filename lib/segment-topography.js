var SegmentTopography = function (status) {
  this.status = status;
  this.curve = {
    value: status.baseSegmentCurve,
    accumulator: -status.baseSegmentCurve
  };
  this.hill = {
    value: status.baseSegmentHill,
    accumulator: -status.baseSegmentHill
  };
}

SegmentTopography.prototype.update = function (segment) {
  this.updateCurve(segment);
  this.updateHill(segment);
}

SegmentTopography.prototype.updateCurve = function (segment) {
  this.curve.value += this.curve.accumulator;
  this.curve.accumulator += segment.curve;
  this.curve.start = this.curve.value;
  this.curve.end = this.curve.value + this.curve.accumulator;
}

SegmentTopography.prototype.updateHill = function (segment) {
  this.hill.value += this.hill.accumulator;
  this.hill.accumulator += segment.hill;
  this.hill.start = this.hill.value;
  this.hill.end = this.hill.value + this.hill.accumulator;
}

module.exports = SegmentTopography;
