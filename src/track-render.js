var TrackRender = function (raceRender, track) {
  this.raceRender = raceRender;
  this.track = track;
  this.player = this.raceRender.race.player;
  this.sprite = new PIXI.Graphics();
}

TrackRender.prototype.update = function () {
  this.sprite.clear();
  var lastPoint = null;
  _(this.raceRender.render.config.drawSegments).times(function (i) {
    var point = this.projectSegmentPoint(this.getNextSegment(i));
    var segmentAhead = point.z > this.track.segmentLength;
    if (lastPoint && segmentAhead) this.drawSegment(point, lastPoint);
    lastPoint = point;
  }.bind(this));
}

TrackRender.prototype.getNextSegment = function (i) {
  var baseSegment = parseInt(this.player.position.z / this.track.segmentLength);
  var segmentIndex = (baseSegment + i) % this.track.segments.length;
  return this.track.segments[segmentIndex];
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
  var segmentZ = segment.length - this.player.position.z;
  var position = { x: 0, y: 0, z: segmentZ };
  var point = this.raceRender.pseudo3d.projectPoint(position);
  point.w = segment.width * point.s;
  point.c = segment.color - (segment.index % 2 == 0 ? 0x101010 : 0);
  point.z = segmentZ;
  return point;
}
