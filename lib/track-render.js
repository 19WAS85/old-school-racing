var _ = require('underscore');
var PIXI = require('../engine/pixi');

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
    var points = this.projectSegment(baseSegment, segment);
    if (points[0].z + this.raceRender.config.cameraDistance < 0) return;
    this.drawSide(points);
    this.drawSegment(points);
  }.bind(this));
}

TrackRender.prototype.getBaseSegment = function () {
  var cameraZ = this.getTrackPlayerZ() - this.raceRender.config.cameraDistance;
  return Math.floor(cameraZ / this.track.segmentLength);
}

TrackRender.prototype.getNextSegment = function (baseSegment, i) {
  var segmentIndex = (baseSegment + i) % this.track.segments.length;
  segmentIndex += segmentIndex < 0 ? this.track.segments.length : 0;
  return this.track.segments[segmentIndex];
}

TrackRender.prototype.projectSegment = function (baseSegment, segment) {
  var loopedZ = segment.index < baseSegment ? this.track.length : 0;
  var segmentZ = segment.length - this.getTrackPlayerZ() + loopedZ;
  return [
    this.projectSegmentPoint(segment, segmentZ),
    this.projectSegmentPoint(segment, segmentZ + this.track.segmentLength)
  ];
}

TrackRender.prototype.getTrackPlayerZ = function () {
  return this.player.position.z % this.track.length;
}

TrackRender.prototype.projectSegmentPoint = function (segment, z) {
  var playerX = -this.player.position.x;
  var point = this.raceRender.pseudo3d.projectPoint({ x: playerX, y: 0, z: z });
  var segmentColorMod = segment.index % 2 == 0 ? 0 : 0x080808;
  point.w = segment.width * point.s;
  point.c = segment.color - segmentColorMod;
  point.sc = segment.sideColor + segmentColorMod;
  point.z = z;
  return point;
}

TrackRender.prototype.drawSegment = function (points) {
  this.sprite.beginFill(points[0].c);
  this.sprite.moveTo(points[0].x - points[0].w, points[0].y);
  this.sprite.lineTo(points[0].x + points[0].w, points[0].y);
  this.sprite.lineTo(points[1].x + points[1].w, points[1].y);
  this.sprite.lineTo(points[1].x - points[1].w, points[1].y);
  this.sprite.endFill();
}

TrackRender.prototype.drawSide = function (points) {
  this.sprite.beginFill(points[0].sc);
  this.sprite.moveTo(0, points[0].y);
  this.sprite.lineTo(this.raceRender.config.width, points[0].y);
  this.sprite.lineTo(this.raceRender.config.width, points[1].y);
  this.sprite.lineTo(0, points[1].y);
  this.sprite.endFill();
}

module.exports = TrackRender;
