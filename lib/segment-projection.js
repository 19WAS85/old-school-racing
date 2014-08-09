var SegmentProjection = function (trackRender) {
  this.trackRender = trackRender;
  this.pseudo3d = this.trackRender.raceRender.pseudo3d;
}

SegmentProjection.prototype.project = function (segment, topography, index, z) {
  var isSegmentLooped = segment.index < index;
  var loopedZ = isSegmentLooped ? this.trackRender.track.length : 0;
  var segmentZ = segment.length - z + loopedZ;
  var segmentX = this.trackRender.baseCar.position.x;
  return this.createProjection(segment, topography, segmentX, segmentZ);
}

SegmentProjection.prototype.createProjection = function (segment, topography, x, z) {
  var startCurve = topography.curve.value;
  var startHill = topography.hill.value;
  var startPoint = this.projectPseudo3DPoint(x + startCurve, startHill, z);
  var endZ = z + this.trackRender.track.segmentLength;
  var endCurve = topography.curve.value + topography.curve.accumulator;
  var endHill = topography.hill.value + topography.hill.accumulator;
  var endPoint = this.projectPseudo3DPoint(x + endCurve, endHill, endZ);
  var segmentColorMod = segment.index % 2 == 0 ? 0 : 0x080808;
  return {
    color: segment.color - segmentColorMod,
    sideColor: segment.sideColor + segmentColorMod,
    points: this.createPoints(segment, startPoint, endPoint),
    sidePoints: this.createSidePoints(startPoint, endPoint),
    startCurve: startCurve, endCurve: endCurve,
    startHill: startHill, endHill: endHill, z: z
  }
}

SegmentProjection.prototype.projectPseudo3DPoint = function (x, y, z) {
  return this.pseudo3d.projectPoint({ x: x, y: y, z: z });
}

SegmentProjection.prototype.createPoints = function (segment, start, end) {
  var startWidth = (segment.width / 2) * start.s;
  var endWidth = (segment.width / 2) * end.s;
  return [
    { x: start.x - startWidth, y: start.y },
    { x: start.x + startWidth, y: start.y },
    { x: end.x + endWidth, y: end.y },
    { x: end.x - endWidth, y: end.y }
  ]
}

SegmentProjection.prototype.createSidePoints = function (startPoint, endPoint) {
  var width = this.trackRender.raceRender.config.width;
  return [
    { x: 0, y: startPoint.y },
    { x: width, y: startPoint.y },
    { x: width, y: endPoint.y },
    { x: 0, y: endPoint.y }
  ]
}

module.exports = SegmentProjection;
