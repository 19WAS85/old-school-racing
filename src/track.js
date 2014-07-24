var Track = function (name, segments) {
  this.name = name;
  this.segments = segments || [];
  this.defaultSegmentOptions = {
    curve: 0, width: 200, color: 0xAAAAAA
  }
}

Track.prototype.addSegments = function (length, parameters) {
  var segments = this.segments;
  parameters = _(this.defaultSegmentOptions).extend(parameters);
  _(length).times(function () {
    var thisParameters = _({ index: segments.length }).extend(parameters);
    segments.push(thisParameters);
  });
}
