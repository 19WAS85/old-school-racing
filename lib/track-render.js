var _ = require('underscore');
var PIXI = require('../engine/pixi');
var SegmentProjection = require('./segment-projection');
var SegmentTopography = require('./segment-topography');

var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.baseCar = this.raceRender.race.baseCar;
  this.cameraDistance = this.raceRender.config.cameraDistance;
  this.sprite = new PIXI.Graphics();
  this.projection = new SegmentProjection(this);
  this.objects = this.createTrackObjectsSprites();
}

TrackRender.prototype.createTrackObjectsSprites = function () {
  return _(this.track.objects).map(function (object) {
    var texture = PIXI.Texture.fromImage(object.image);
    object.sprite = new PIXI.Sprite(texture);
    object.sprite.anchor.x = 0.5;
    object.sprite.anchor.y = 1;
    return object;
  });
}

TrackRender.prototype.update = function (status) {
  this.sprite.clear();
  this.projectSegments(status);
  this.drawSegments(status);
  this.drawObjects(status);
}

TrackRender.prototype.projectSegments = function (status) {
  var topography = new SegmentTopography(status);
  for (var i = 0; i < this.track.segments.length; i++) {
    var segment = status.getNextSegment(i);
    var needDraw = this.isSegmentValidToDraw(status.baseZ, i);
    segment.projection = this.projection.create(status, segment, topography, needDraw);
    topography.update(segment);
  }
}

TrackRender.prototype.drawSegments = function (status) {
  for (var i = 0; i < this.track.segments.length; i++) {
    var j = this.track.segments.length - i;
    var segment = status.getNextSegment(j);
    if (!segment.projection.needDraw) continue;
    this.drawSegment(segment.projection.sideColor, segment.projection.sideBounds);
    this.drawSegment(segment.projection.color, segment.projection.bounds);
    if (!segment.projection.lines) continue;
    for (var l = 0; l < segment.projection.lines.length; l++) {
      this.drawSegment(segment.lineColor, segment.projection.lines[l]);
    }
  }
}

TrackRender.prototype.isSegmentValidToDraw = function (z, i) {
  var segmentBack = z + this.cameraDistance < 0;
  var segmentFar = i > this.raceRender.config.drawSegments;
  return !segmentBack && !segmentFar;
}

TrackRender.prototype.drawSegment = function (color, points) {
  this.sprite.beginFill(color);
  this.sprite.moveTo(points[0], points[1]);
  this.sprite.lineTo(points[2], points[3]);
  this.sprite.lineTo(points[4], points[5]);
  this.sprite.lineTo(points[6], points[7]);
  this.sprite.endFill();
}

TrackRender.prototype.drawObjects = function (status) {
  for (var i = 0; i < this.objects.length; i++) {
    var segment = status.track.getSegment(this.objects[i].index);
    var position = this.objects[i].position * segment.projection.s;
    this.objects[i].sprite.position.x = position + segment.projection.center;
    this.objects[i].sprite.position.y = segment.projection.bounds[1];
    this.objects[i].sprite.scale.set(segment.projection.s);
    this.objects[i].sprite.z = segment.length;
  }
}

module.exports = TrackRender;
