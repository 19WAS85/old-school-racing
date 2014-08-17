var _ = require('underscore');

var SegmentProjection = function (trackRender) {
  this.trackRender = trackRender;
}

SegmentProjection.prototype.create = function (status, segment, topography, needDraw) {
  var segmentZ = segment.length - status.baseZ + status.getLoopedZ(segment);
  var segmentX = status.baseCar.position.x;
  var start = this.projectPoint(
    segmentX + topography.curve.start,
    topography.hill.start,
    segmentZ);
  var end = this.projectPoint(
    segmentX + topography.curve.end,
    topography.hill.end,
    segmentZ + status.segmentLength);
  var bounds = this.createSegmentBounds(segment, start, end);
  var projection = {
    bounds: bounds, segmentZ: segmentZ, needDraw: needDraw, s: start.s,
    left: bounds[0], right: bounds[2], center: (bounds[0] + bounds[2]) / 2,
    curve: { start: topography.curve.start, end: topography.curve.end },
    hill: { start: topography.hill.start, end: topography.hill.end }
  };
  return needDraw ? this.updateToDraw(segment, projection, start, end) : projection;
}

SegmentProjection.prototype.updateToDraw = function (segment, projection, start, end) {
  var segmentColorMod = segment.index % 2 == 0 ? 0 : 0x080808;
  projection.color = segment.color - segmentColorMod;
  projection.lines = this.createLines(segment, start, end);
  projection.sideBounds = this.createSideBounds(start, end);
  projection.sideColor = segment.sideColor + segmentColorMod;
  return projection;
}

SegmentProjection.prototype.createLines = function (segment, start, end) {
  if (segment.index % 10 > 1) return null;
  var startWidth = start.x - (segment.width / 2) * start.s;
  var endWidth = end.x - (segment.width / 2) * end.s;
  return _.chain(segment.lines).range().map(function (i) {
    var lineX = segment.width / (segment.lines + 1) * (i + 1);
    return [
      startWidth + (lineX - segment.lineSize) * start.s, start.y,
      startWidth + (lineX + segment.lineSize) * start.s, start.y,
      endWidth + (lineX + segment.lineSize) * end.s, end.y,
      endWidth + (lineX - segment.lineSize) * end.s, end.y
    ];
  }).value();
}

SegmentProjection.prototype.createSegmentBounds = function (segment, start, end) {
  var startWidth = (segment.width / 2) * start.s;
  var endWidth = (segment.width / 2) * end.s;
  return [
    start.x - startWidth, start.y, start.x + startWidth, start.y,
    end.x + endWidth, end.y, end.x - endWidth, end.y
  ];
}

SegmentProjection.prototype.createSideBounds = function (start, end) {
  var width = this.trackRender.raceRender.config.width;
  return [0, start.y, width, start.y, width, end.y, 0, end.y];
}

SegmentProjection.prototype.projectPoint = function (x, y, z) {
  return this.trackRender.raceRender.pseudo3d.projectPoint({ x: x, y: y, z: z });
}

module.exports = SegmentProjection;
