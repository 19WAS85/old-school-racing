var _ = require('underscore');
var PIXI = require('../engine/pixi-1.6.0');

var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.player = this.raceRender.race.player;
  this.sprite = new PIXI.Graphics();
}

TrackRender.prototype.update = function () {
  this.sprite.clear();
  var baseSegment = this.getBaseSegment();
  _(this.raceRender.render.config.drawSegments).times(function (i) {
    var segment = this.getNextSegment(baseSegment, i);
    if (!segment) return; // todo: fix it.
    var points = this.projectSegment(baseSegment, segment);
    var segmentAhead = points[0].z + this.raceRender.config.cameraDistance > 0;
    if (segmentAhead) this.drawSegment(points);
  }.bind(this));
}

TrackRender.prototype.getBaseSegment = function () {
  var cameraZ = this.player.position.z - this.raceRender.config.cameraDistance;
  return Math.floor(cameraZ / this.track.segmentLength);
}

TrackRender.prototype.getNextSegment = function (baseSegment, i) {
  var segmentIndex = (baseSegment + i) % this.track.segments.length;
  return this.track.segments[segmentIndex];
}

TrackRender.prototype.projectSegment = function (baseSegment, segment) {
  var loopedZ = segment.index < baseSegment ? this.track.length : 0;
  var segmentZ = segment.length - this.player.position.z + loopedZ;
  return [
    this.projectSegmentPoint(segment, segmentZ),
    this.projectSegmentPoint(segment, segmentZ + this.track.segmentLength)
  ];
}

TrackRender.prototype.projectSegmentPoint = function (segment, z) {
  var point = this.raceRender.pseudo3d.projectPoint({ x: 0, y: 0, z: z });
  point.w = segment.width * point.s;
  point.c = segment.color - (segment.index % 2 == 0 ? 0 : 0x101010);
  point.z = z;
  return point;
}

TrackRender.prototype.drawSegment = function (point) {
  this.sprite.beginFill(point[0].c);
  this.sprite.moveTo(point[0].x - point[0].w, point[0].y);
  this.sprite.lineTo(point[0].x + point[0].w, point[0].y);
  this.sprite.lineTo(point[1].x + point[1].w, point[1].y);
  this.sprite.lineTo(point[1].x - point[1].w, point[1].y);
  this.sprite.endFill();
}

module.exports = TrackRender;
