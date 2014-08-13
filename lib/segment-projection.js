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
  return this.createProjection(s, t, segmentX, segmentZ, draw);
}

SegmentProjection.prototype.createProjection = function (s, t, x, z, draw) {
  var startCurve = t.curve.value;
  var startHill = t.hill.value;
  var startPoint = this.projectPseudo3DPoint(x + startCurve, startHill, z);
  var endZ = z + this.trackRender.track.segmentLength;
  var endCurve = t.curve.value + t.curve.accumulator;
  var endHill = t.hill.value + t.hill.accumulator;
  var endPoint = this.projectPseudo3DPoint(x + endCurve, endHill, endZ);
  var projection = {
    points: this.createPoints(s, startPoint, endPoint),
    startCurve: startCurve, endCurve: endCurve,
    startHill: startHill, endHill: endHill,
    z: z, draw: draw
  };
  if (draw) {
    var segmentColorMod = s.index % 2 == 0 ? 0 : 0x080808;
    projection.color = s.color - segmentColorMod;
    projection.lines = this.createLines(s, startPoint, endPoint);
    projection.sidePoints = this.createSidePoints(startPoint, endPoint);
    projection.sideColor = s.sideColor + segmentColorMod;
  }
  return projection;
}

SegmentProjection.prototype.createPoints = function (segment, start, end) {
  var startWidth = (segment.width / 2) * start.s;
  var endWidth = (segment.width / 2) * end.s;
  return [
    { x: start.x - startWidth, y: start.y },
    { x: start.x + startWidth, y: start.y },
    { x: end.x + endWidth, y: end.y },
    { x: end.x - endWidth, y: end.y }
  ];
}

SegmentProjection.prototype.createSidePoints = function (startPoint, endPoint) {
  var width = this.trackRender.raceRender.config.width;
  return [
    { x: 0, y: startPoint.y },
    { x: width, y: startPoint.y },
    { x: width, y: endPoint.y },
    { x: 0, y: endPoint.y }
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

SegmentProjection.prototype.projectPseudo3DPoint = function (x, y, z) {
  return this.pseudo3d.projectPoint({ x: x, y: y, z: z });
}

module.exports = SegmentProjection;
