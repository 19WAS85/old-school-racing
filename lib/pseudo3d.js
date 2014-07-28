var Pseudo3D = function (config) {
  this.config = config;
  this.scaleCoeficient = 200;
}

Pseudo3D.prototype.projectPoint = function(point) {
  var x = point.x * this.config.scale;
  var y = (point.y + this.config.cameraHeight) * this.config.scale;
  var z = (point.z + this.config.cameraDistance) * this.config.scale;
  var xScale = this.config.width / this.config.fieldOfView;
  var yScale = this.config.height / this.config.fieldOfView;
  var scaleCoeficient = this.config.scale * this.scaleCoeficient;
  return {
    x: x * xScale / z + this.config.halfWidth,
    y: y * yScale / z + this.config.halfHeight,
    s: (1 / (point.z + this.config.cameraDistance)) * scaleCoeficient
  };
}

module.exports = Pseudo3D;
