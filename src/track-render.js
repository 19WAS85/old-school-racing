var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.sprite = new PIXI.Graphics();
}

TrackRender.prototype.update = function () {
  this.sprite.clear();
  var lastPoint = null;
  var baseSegmentIndex = this.getActualBaseSegmentIndex();
  _(this.raceRender.render.config.drawSegments).times(function (i) {
    var segmentIndex = baseSegmentIndex + i % this.track.segments.length;
    var segment = this.track.segments[segmentIndex];
    var point = this.projectSegmentPoint(segment);
    if (lastPoint) this.drawSegment(point, lastPoint);
    lastPoint = point;
  }.bind(this));
}

TrackRender.prototype.getActualBaseSegmentIndex = function () {
  var playerZ = this.raceRender.race.player.position.z;
  var segmentLength = this.track.segmentLength;
  return parseInt(playerZ / segmentLength);
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
  var position = { x: 0, y: 0, z: segment.length };
  var point = this.raceRender.pseudo3d.projectPoint(position);
  point.w = segment.width * point.s;
  point.c = segment.color - (segment.index % 2 == 0 ? 0x101010 : 0);
  return point;
}
