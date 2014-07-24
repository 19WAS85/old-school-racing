var Pseudo3D = function (config, camera) {
  this.config = config;
  this.camera = camera;
  this.scaleCoeficient = 200;
  this.segmentLength = 20;
}

Pseudo3D.prototype.projectPoint = function(point) {
  var x = point.x * this.config.scale;
  var y = (point.y + this.camera.height) * this.config.scale;
  var z = (point.z + this.camera.distance) * this.config.scale;
  var xScale = this.config.width / this.camera.fieldOfView;
  var yScale = this.config.height / this.camera.fieldOfView;
  var scaleCoeficient = this.config.scale * this.scaleCoeficient;
  return {
    x: x * xScale / z + this.config.halfWidth,
    y: y * yScale / z + this.config.halfHeight,
    s: (1 / (point.z + this.camera.distance)) * scaleCoeficient
  };
}
