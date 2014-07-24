var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.sprite = new PIXI.Graphics();
}

TrackRender.prototype.update = function () {
  this.sprite.clear();
  var lastPoint = null;
  _(this.track.segments).each(function (segment) {
    var point = this.projectSegmentPoint(segment);
    if (lastPoint) this.drawSegment(point, lastPoint);
    lastPoint = point;
  }.bind(this));
}

TrackRender.prototype.drawSegment = function (point, lastPoint) {
  this.sprite.beginFill(point.c);
  this.sprite.moveTo(point.x - point.w, point.y);
  this.sprite.lineTo(point.x + point.w, point.y);
  this.sprite.lineTo(lastPoint.x + lastPoint.w, lastPoint.y);
  this.sprite.lineTo(lastPoint.x - lastPoint.w, lastPoint.y);
  this.sprite.endFill();
}

TrackRender.prototype.projectSegmentPoint = function(segment) {
  var length = this.raceRender.pseudo3d.segmentLength;
  var halfWidth = this.raceRender.render.config.halfWidth;
  var position = { x: 0, y: 0, z: segment.index * length };
  var point = this.raceRender.pseudo3d.projectPoint(position);
  point.w = segment.width * point.s;
  point.c = segment.index % 2 == 0 ? segment.color : segment.color - 0x101010;
  return point;
}
