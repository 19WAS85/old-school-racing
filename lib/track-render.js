var _ = require('underscore');
var PIXI = require('../engine/pixi');
var SegmentProjection = require('./segment-projection')

var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.player = this.raceRender.race.player;
  this.sprite = new PIXI.Graphics();
  this.segmentProjection = new SegmentProjection(this);
  this.cameraDistance = this.raceRender.config.cameraDistance;
}

TrackRender.prototype.update = function () {
  this.sprite.clear();
  var z = this.track.getRelativeZ(this.player.position.z);
  var index = this.track.getSegmentIndexByZ(z) - 1;
  var curve = this.createCurveControl(z, index);
  var hill = { accumulator: 0, value: 0 };
  _(this.track.segments.length).times(function (i) {
    var s = this.getNextSegment(index, i);
    s.projection = this.segmentProjection.project(s, curve, hill, index, z);
    var segmentBack = s.projection.z + this.cameraDistance < 0;
    var segmentFar = i > this.raceRender.config.drawSegments;
    var afterTheHill = s.projection.points[1].y <= s.projection.points[2].y;
    if (segmentBack || segmentFar || afterTheHill) return;
    this.drawSegment(s.projection.sideColor, s.projection.sidePoints);
    this.drawSegment(s.projection.color, s.projection.points);
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
