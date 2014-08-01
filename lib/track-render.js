var _ = require('underscore');
var PIXI = require('../engine/pixi');
var SegmentProjection = require('./segment-projection')

var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.player = this.raceRender.race.player;
  this.sprite = new PIXI.Graphics();
}

TrackRender.prototype.update = function () {
  this.sprite.clear();
  var playerZ = this.getTrackPlayerZ();
  var baseSegment = this.getBaseSegment(playerZ);
  var curveControl = { accumulator: 0, value: 0 }
  _(this.raceRender.render.config.drawSegments).times(function (i) {
    var segment = this.getNextSegment(baseSegment, i);
    var segmentProjection = new SegmentProjection(this, segment, curveControl);
    var projection = segmentProjection.project(baseSegment, playerZ);
    if (projection.z + this.raceRender.config.cameraDistance < 0) return;
    this.drawSegment(projection.sideColor, projection.sidePoints);
    this.drawSegment(projection.color, projection.points);
  }.bind(this));
}

TrackRender.prototype.getTrackPlayerZ = function () {
  return this.player.position.z % this.track.length;
}

TrackRender.prototype.getBaseSegment = function (playerZ) {
  var cameraZ = playerZ - this.raceRender.config.cameraDistance;
  return Math.floor(cameraZ / this.track.segmentLength);
}

TrackRender.prototype.getNextSegment = function (baseSegment, i) {
  var segmentIndex = (baseSegment + i) % this.track.segments.length;
  segmentIndex += segmentIndex < 0 ? this.track.segments.length : 0;
  return this.track.segments[segmentIndex];
}

TrackRender.prototype.drawSegment = function (color, points) {
  this.sprite.beginFill(color);
  this.sprite.moveTo(points[0].x, points[0].y);
  this.sprite.lineTo(points[1].x, points[1].y);
  this.sprite.lineTo(points[2].x, points[2].y);
  this.sprite.lineTo(points[3].x, points[3].y);
  this.sprite.endFill();
}

module.exports = TrackRender;
