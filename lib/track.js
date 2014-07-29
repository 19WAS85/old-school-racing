var _ = require('underscore');

var Track = function (name, segments) {
  this.name = name;
  this.segments = segments || [];
  this.segmentLength = 30;
  this.defaultSegmentOptions = {
    curve: 0, width: 200, color: 0xAAAAAA
  }
}

Track.prototype.addSegments = function (length, parameters) {
  parameters = _(_(this.defaultSegmentOptions).clone()).extend(parameters);
  _(length).times(function () {
    var segment = _({ index: this.segments.length }).extend(parameters);
    segment.length = segment.index * this.segmentLength;
    this.segments.push(segment);
  }.bind(this));
  this.length = this.segments.length * this.segmentLength;
}

module.exports = Track;
