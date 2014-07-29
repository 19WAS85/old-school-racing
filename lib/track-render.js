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
  var lastPoint = null;
  var baseSegment = this.getBaseSegment();
  _(this.raceRender.render.config.drawSegments).times(function (i) {
    var segment = this.getNextSegment(baseSegment, i);
    if (!segment) return; // todo: fix it.
    var point = this.projectSegmentPoint(baseSegment, segment);
    var segmentAhead = point.z + this.track.segmentLength > 0;
    if (lastPoint && segmentAhead) this.drawSegment(point, lastPoint);
    lastPoint = point;
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

TrackRender.prototype.drawSegment = function (point, lastPoint) {
  this.sprite.beginFill(point.c);
  this.sprite.moveTo(point.x - point.w, point.y);
  this.sprite.lineTo(point.x + point.w, point.y);
  this.sprite.lineTo(lastPoint.x + lastPoint.w, lastPoint.y);
  this.sprite.lineTo(lastPoint.x - lastPoint.w, lastPoint.y);
  this.sprite.endFill();
}

TrackRender.prototype.projectSegmentPoint = function(baseSegment, segment) {
  var loopedZ = segment.index < baseSegment ? this.track.length : 0;
  var segmentZ = segment.length - this.player.position.z + loopedZ;
  var position = { x: 0, y: 0, z: segmentZ };
  var point = this.raceRender.pseudo3d.projectPoint(position);
  point.w = segment.width * point.s;
  point.c = segment.color - (segment.index % 2 == 0 ? 0x101010 : 0);
  point.z = segmentZ;
  return point;
}

module.exports = TrackRender;
