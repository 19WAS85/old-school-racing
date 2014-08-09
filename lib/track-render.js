var _ = require('underscore');
var PIXI = require('../engine/pixi');
var SegmentProjection = require('./segment-projection')

var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.baseCar = this.raceRender.race.baseCar;
  this.sprite = new PIXI.Graphics();
  this.segmentProjection = new SegmentProjection(this);
  this.cameraDistance = this.raceRender.config.cameraDistance;
}

TrackRender.prototype.update = function () {
  this.sprite.clear();
  var z = this.track.getRelativeZ(this.baseCar.position.z);
  var index = this.track.getSegmentIndexByZ(z) - 2;
  this.projectSegments(z, index);
  this.drawSegments(z, index);
}

TrackRender.prototype.projectSegments = function (z, index) {
  var topography = this.createTopographyControl(z, index);
  _(this.track.segments.length).times(function (i) {
    var s = this.getNextSegment(index, i);
    s.projection = this.segmentProjection.project(s, topography, index, z);
    this.adjustTopographyValues(topography, s);
  }.bind(this));
}

TrackRender.prototype.drawSegments = function (z, index) {
  _(this.track.segments.length).times(function (i) {
    var j = this.track.segments.length - i;
    var s = this.getNextSegment(index, j);
    if (this.isSegmentNotValidToDraw(s, j)) return;
    this.drawSegment(s.projection.sideColor, s.projection.sidePoints);
    this.drawSegment(s.projection.color, s.projection.points);
    _(s.projection.lines).each(function (line) {
      this.drawSegment(s.lineColor, line)
    }.bind(this));
  }.bind(this));
}

TrackRender.prototype.adjustTopographyValues = function (topography, segment) {
  topography.curve.value += topography.curve.accumulator;
  topography.curve.accumulator += segment.curve;
  topography.hill.value += topography.hill.accumulator;
  topography.hill.accumulator += segment.hill;
}

TrackRender.prototype.isSegmentNotValidToDraw = function (s, i) {
  var segmentBack = s.projection.z + this.cameraDistance < 0;
  var segmentFar = i > this.raceRender.config.drawSegments;
  return segmentBack || segmentFar;
}

TrackRender.prototype.createTopographyControl = function (z, baseSegmentIndex) {
  var baseSegment = this.track.getSegment(baseSegmentIndex);
  var segmentLength = this.track.segmentLength;
  var segmentPercent = (z % segmentLength) / segmentLength;
  var baseSegmentCurve = segmentPercent * baseSegment.curve;
  var baseSegmentHill = segmentPercent * baseSegment.hill;
  return {
    curve: { value: baseSegmentCurve, accumulator: -baseSegmentCurve },
    hill: { value: baseSegmentHill, accumulator: -baseSegmentHill },
  }
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
