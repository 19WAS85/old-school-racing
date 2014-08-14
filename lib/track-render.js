var PIXI = require('../engine/pixi');
var SegmentProjection = require('./segment-projection');
var SegmentTopography = require('./segment-topography');

var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.baseCar = this.raceRender.race.baseCar;
  this.sprite = new PIXI.Graphics();
  this.segmentProjection = new SegmentProjection(this);
  this.cameraDistance = this.raceRender.config.cameraDistance;
}

TrackRender.prototype.update = function (status) {
  this.sprite.clear();
  this.projectSegments(status);
  this.drawSegments(status);
}

TrackRender.prototype.projectSegments = function (status) {
  var topography = new SegmentTopography(status);
  for (var i = 0; i < this.track.segments.length; i++) {
    var s = status.getNextSegment(i);
    var draw = !this.isSegmentNotValidToDraw(status.baseZ, i);
    s.projection = this.segmentProjection.project(status, s, topography, draw);
    topography.update(s);
  }
}

TrackRender.prototype.drawSegments = function (status) {
  for (var i = 0; i < this.track.segments.length; i++) {
    var j = this.track.segments.length - i;
    var s = status.getNextSegment(j);
    if (!s.projection.draw) continue;
    this.drawSegment(s.projection.sideColor, s.projection.sidePoints);
    this.drawSegment(s.projection.color, s.projection.points);
    for (var l = 0; s.projection.lines && l < s.projection.lines.length; l++) {
      this.drawSegment(s.lineColor, s.projection.lines[l]);
    }
  }
}

TrackRender.prototype.isSegmentNotValidToDraw = function (z, i) {
  var segmentBack = z + this.cameraDistance < 0;
  var segmentFar = i > this.raceRender.config.drawSegments;
  return segmentBack || segmentFar;
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
