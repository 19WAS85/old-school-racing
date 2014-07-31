var SegmentProjection = function (trackRender, segment, baseSegment, playerZ) {
  this.trackRender = trackRender;
  this.segment = segment;
  this.baseSegment = baseSegment;
  this.playerZ = playerZ;
  this.pseudo3d = this.trackRender.raceRender.pseudo3d;
  this.projection = this.project();
}

SegmentProjection.prototype.project = function () {
  var isSegmentLooped = this.segment.index < this.baseSegment;
  var loopedZ = isSegmentLooped ? this.trackRender.track.length : 0;
  var segmentZ = this.segment.length - this.playerZ + loopedZ;
  var segmentX = -this.trackRender.player.position.x;
  this.createProjection(segmentX, segmentZ);
}

SegmentProjection.prototype.createProjection = function (segmentX, segmentZ) {
  var endSegmentZ = segmentZ + this.trackRender.track.segmentLength;
  var startPoint = this.projectPseudo3DPoint(segmentX, 0, segmentZ);
  var endPoint = this.projectPseudo3DPoint(segmentX, 0, endSegmentZ);
  var segmentColorMod = this.segment.index % 2 == 0 ? 0 : 0x080808;
  this.color = this.segment.color - segmentColorMod;
  this.sideColor = this.segment.sideColor + segmentColorMod;
  this.points = this.createPoints(startPoint, endPoint);
  this.sidePoints = this.createSidePoints(startPoint, endPoint);
  this.z = segmentZ;
}

SegmentProjection.prototype.projectPseudo3DPoint = function (x, y, z) {
  return this.pseudo3d.projectPoint({ x: x, y: y, z: z });
}

SegmentProjection.prototype.createPoints = function (startPoint, endPoint) {
  var startWidth = (this.segment.width / 2) * startPoint.s;
  var endWidth = (this.segment.width / 2) * endPoint.s;
  return [
    { x: startPoint.x - startWidth, y: startPoint.y },
    { x: startPoint.x + startWidth, y: startPoint.y },
    { x: endPoint.x + endWidth, y: endPoint.y },
    { x: endPoint.x - endWidth, y: endPoint.y }
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
