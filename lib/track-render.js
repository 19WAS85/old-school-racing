var _ = require('underscore');
var PIXI = require('../engine/pixi');
var SegmentProjection = require('./segment-projection');
var SegmentTopography = require('./segment-topography');

var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.baseCar = this.raceRender.race.baseCar;
  this.config = this.raceRender.config;
  this.projection = new SegmentProjection(this);
  this.sprites = this.createTrackSprites();
  this.objects = this.createTrackObjectsSprites();
  this.spriteIndex = 0;
}

TrackRender.prototype.createTrackSprites = function () {
  var sprites = [];
  var size = Math.ceil(this.config.drawDistance / this.track.segmentLength);
  for (var i = 0; i < size; i++) { sprites.push(new PIXI.Graphics()) }
  return sprites;
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
  this.projectSegments(status);
  this.drawSegments(status);
  this.drawObjects(status);
}

TrackRender.prototype.projectSegments = function (status) {
  var topography = new SegmentTopography(status);
  for (var i = 0; i < this.track.segments.length; i++) {
    var segment = status.getNextSegment(i);
    var needDraw = this.isSegmentValidToDraw(status, segment);
    segment.projection = this.projection.create(status, segment, topography, needDraw);
    topography.update(segment);
  }
}

TrackRender.prototype.drawSegments = function (status) {
  for (var i = 0; i < this.track.segments.length; i++) {
    var j = this.track.segments.length - i;
    var segment = status.getNextSegment(j);
    if (!segment.projection.needDraw) continue;
    this.drawSegment(status, segment);
  }
}

TrackRender.prototype.isSegmentValidToDraw = function (status, segment) {
  var segmentZ = segment.projection ? segment.projection.segmentZ : segment.length;
  var segmentBack = segmentZ + this.config.cameraDistance < 0;
  return !segmentBack && status.isVisible(segmentZ);
}

TrackRender.prototype.drawSegment = function (status, segment) {
  var sprite = this.sprites[this.spriteIndex++ % this.sprites.length];
  sprite.z = this.getSpriteZ(segment, status);
  sprite.clear();
  this.drawPolygon(sprite, segment.projection.sideColor, segment.projection.sideBounds);
  this.drawPolygon(sprite, segment.projection.color, segment.projection.bounds);
  if (!segment.projection.lines) return;
  for (var l = 0; l < segment.projection.lines.length; l++) {
    this.drawPolygon(sprite, segment.lineColor, segment.projection.lines[l]);
  }
}

TrackRender.prototype.drawPolygon = function (sprite, color, points) {
  sprite.beginFill(color);
  sprite.moveTo(points[0], points[1]);
  sprite.lineTo(points[2], points[3]);
  sprite.lineTo(points[4], points[5]);
  sprite.lineTo(points[6], points[7]);
  sprite.endFill();
}

TrackRender.prototype.drawObjects = function (status) {
  for (var i = 0; i < this.objects.length; i++) {
    var segment = status.track.getSegment(this.objects[i].index);
    this.objects[i].sprite.visible = status.isVisible(segment.projection.segmentZ);
    if (!this.objects[i].sprite.visible) continue;
    var position = this.objects[i].position * segment.projection.s;
    this.objects[i].sprite.position.x = position + segment.projection.center;
    this.objects[i].sprite.position.y = segment.projection.bounds[1];
    this.objects[i].sprite.scale.set(segment.projection.s);
    this.objects[i].sprite.z = this.getSpriteZ(segment, status);
  }
}

TrackRender.prototype.getSpriteZ = function (segment, status) {
  return segment.length + this.track.segmentLength + status.getLoopedZ(segment);
}

module.exports = TrackRender;
