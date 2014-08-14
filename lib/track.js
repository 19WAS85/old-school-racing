var _ = require('underscore');

var Track = function (name, segments, objects) {
  this.name = name;
  this.segments = segments || [];
  this.objects = objects || [];
  this.segmentLength = 20;
  this.defaultSegmentOptions = {
    width: 1000,
    curve: 0,
    hill: 0,
    color: 0xAAAAAA,
    sideColor: 0x99CC66,
    lines: 2,
    lineSize: 15,
    lineColor: 0xEEEEEE,
  }
}

Track.prototype.addSegments = function (length, parameters) {
  var defaultOptions = _(this.defaultSegmentOptions).clone();
  parameters = _(defaultOptions).extend(parameters);
  _(length).times(function () {
    var segment = _({ index: this.segments.length }).extend(parameters);
    segment.length = segment.index * this.segmentLength;
    this.segments.push(segment);
  }.bind(this));
  this.length = this.segments.length * this.segmentLength;
}

Track.prototype.getSegmentByZ = function (z) {
  return this.segments[this.getSegmentIndexByZ(z)];
}

Track.prototype.getSegmentIndexByZ = function (z) {
  return Math.floor(this.getRelativeZ(z) / this.segmentLength);
}

Track.prototype.getRelativeZ = function (z) {
  z += this.length * Math.ceil(Math.abs(z / this.length));
  return z % this.length;
}

Track.prototype.getSegment = function (index) {
  index += index < 0 ? this.segments.length : 0;
  return this.segments[index % this.segments.length];
}

Track.prototype.addObject = function (index, image, position) {
  this.objects.push({ index: index, image: image, position: position });
}

module.exports = Track;
