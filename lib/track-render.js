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
  var playerZ = this.track.getRelativeZ(this.player.position.z);
  var baseSegmentIndex = this.track.getSegmentIndexByZ(playerZ) - 1;
  var curveControl = this.createCurveControl(playerZ, baseSegmentIndex);
  _(this.track.segments.length).times(function (i) {
    var segment = this.getNextSegment(baseSegmentIndex, i);
    var segmentProjection = new SegmentProjection(this, segment, curveControl);
    segment.projection = segmentProjection.project(baseSegmentIndex, playerZ);
    if (segment.projection.z + this.raceRender.config.cameraDistance < 0) return;
    this.drawSegment(segment.projection.sideColor, segment.projection.sidePoints);
    this.drawSegment(segment.projection.color, segment.projection.points);
  }.bind(this));
}

TrackRender.prototype.createCurveControl = function (z, baseSegmentIndex) {
  var baseSegment = this.track.getSegment(baseSegmentIndex);
  var segmentLength = this.track.segmentLength;
  var segmentPercent = (z % segmentLength) / segmentLength;
  var baseSegmentCurve = segmentPercent * baseSegment.curve;
  return { value: baseSegmentCurve, accumulator: -baseSegmentCurve }
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
