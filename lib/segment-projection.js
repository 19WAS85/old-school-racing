var _ = require('underscore');

var SegmentProjection = function (trackRender) {
  this.trackRender = trackRender;
  this.pseudo3d = this.trackRender.raceRender.pseudo3d;
}

SegmentProjection.prototype.project = function (status, s, t, draw) {
  var isSegmentLooped = s.index < status.baseSegmentIndex;
  var loopedZ = isSegmentLooped ? this.trackRender.track.length : 0;
  var segmentZ = s.length - status.baseZ + loopedZ;
  var segmentX = this.trackRender.baseCar.position.x;
  return this.createProjection(status, s, t, segmentX, segmentZ, draw);
}

SegmentProjection.prototype.createProjection = function (status, s, t, x, z, draw) {
  var start = this.projectPoint(x + t.curve.start, t.hill.start, z);
  var end = this.projectPoint(x + t.curve.end, t.hill.end, z + status.segmentLength);
  var projection = {
    points: this.createSegmentPoints(s, start, end),
    curve: { start: t.curve.start, end: t.curve.end },
    hill: { start: t.hill.start, end: t.hill.end },
    z: z, draw: draw
  };
  if (draw) {
    var segmentColorMod = s.index % 2 == 0 ? 0 : 0x080808;
    projection.color = s.color - segmentColorMod;
    projection.lines = this.createLines(s, start, end);
    projection.sidePoints = this.createSidePoints(start, end);
    projection.sideColor = s.sideColor + segmentColorMod;
  }
  return projection;
}

SegmentProjection.prototype.createSegmentPoints = function (segment, start, end) {
  var startWidth = (segment.width / 2) * start.s;
  var endWidth = (segment.width / 2) * end.s;
  return [
    { x: start.x - startWidth, y: start.y },
    { x: start.x + startWidth, y: start.y },
    { x: end.x + endWidth, y: end.y },
    { x: end.x - endWidth, y: end.y }
  ];
}

SegmentProjection.prototype.createSidePoints = function (start, end) {
  var width = this.trackRender.raceRender.config.width;
  return [
    { x: 0, y: start.y },
    { x: width, y: start.y },
    { x: width, y: end.y },
    { x: 0, y: end.y }
  ];
}

SegmentProjection.prototype.createLines = function (segment, start, end) {
  if (segment.index % 10 > 1) return null;
  var startWidth = start.x - (segment.width / 2) * start.s;
  var endWidth = end.x - (segment.width / 2) * end.s;
  return _.chain(segment.lines).range().map(function (i) {
    var lineX = segment.width / (segment.lines + 1) * (i + 1);
    return [
      { x: startWidth + (lineX - segment.lineSize) * start.s, y: start.y },
      { x: startWidth + (lineX + segment.lineSize) * start.s, y: start.y },
      { x: endWidth + (lineX + segment.lineSize) * end.s, y: end.y },
      { x: endWidth + (lineX - segment.lineSize) * end.s, y: end.y }
    ];
  }).value();
}

SegmentProjection.prototype.projectPoint = function (x, y, z) {
  return this.pseudo3d.projectPoint({ x: x, y: y, z: z });
}

module.exports = SegmentProjection;
