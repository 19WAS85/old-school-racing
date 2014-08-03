var _ = require('underscore');

var Track = function (name, segments) {
  this.name = name;
  this.segments = segments || [];
  this.segmentLength = 20;
  this.defaultSegmentOptions = {
    curve: 0, width: 400, color: 0xAAAAAA, sideColor: 0x99CC66
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

Track.prototype.getSegment = function (index) {
  index += index < 0 ? this.segments.length : 0;
  return this.segments[index];
}

module.exports = Track;
