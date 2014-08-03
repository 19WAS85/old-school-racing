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
  var baseSegmentIndex = this.getBaseSegmentIndex(playerZ);
  var curveControl = this.createCurveControl(playerZ, baseSegmentIndex);
  _(this.raceRender.render.config.drawSegments).times(function (i) {
    var segment = this.getNextSegment(baseSegmentIndex, i);
    var segmentProjection = new SegmentProjection(this, segment, curveControl);
    var projection = segmentProjection.project(baseSegmentIndex, playerZ);
    if (projection.z + this.raceRender.config.cameraDistance < 0) return;
    this.drawSegment(projection.sideColor, projection.sidePoints);
    this.drawSegment(projection.color, projection.points);
  }.bind(this));
}

TrackRender.prototype.createCurveControl = function (z, baseSegmentIndex) {
  var baseSegment = this.track.getSegment(baseSegmentIndex);
  var segmentLength = this.track.segmentLength;
  var segmentPercent = (z % segmentLength) / segmentLength;
  var baseSegmentCurve = -segmentPercent * baseSegment.curve;
  return { accumulator: baseSegmentCurve, value: baseSegmentCurve }
}

TrackRender.prototype.getTrackPlayerZ = function () {
  return this.player.position.z % this.track.length;
}

TrackRender.prototype.getBaseSegmentIndex = function (playerZ) {
  var cameraZ = playerZ; //- this.raceRender.config.cameraDistance;
  return Math.floor(cameraZ / this.track.segmentLength);
}

TrackRender.prototype.getNextSegment = function (baseSegmentIndex, i) {
  var segmentIndex = (baseSegmentIndex + i) % this.track.segments.length;
  return this.track.getSegment(segmentIndex);
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
