var RenderConfig = function () {
  this.scale = 0.5;
  this.width = 1920 * this.scale;
  this.height = 1080 * this.scale;
  this.halfWidth = this.width / 2;
  this.halfHeight = this.height / 2;
  this.cameraHeight = 35;
  this.cameraDistance = this.cameraHeight * 1.3;
  this.fieldOfView = Math.tan(45);
}

module.exports = RenderConfig;
