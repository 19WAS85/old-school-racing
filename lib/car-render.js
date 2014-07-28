var PIXI = require('./pixi-1.6.0');

var CarRender = function (raceRender, car, pseudo3d) {
  this.raceRender = raceRender;
  this.car = car;
  this.asset = car.image;
  this.texture = PIXI.Texture.fromImage(this.asset);
  this.sprite = new PIXI.Sprite(this.texture);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
}

CarRender.prototype.update = function () {
  var position = this.getRelativePosition();
  var point = this.raceRender.pseudo3d.projectPoint(position);
  this.sprite.position.x = point.x;
  this.sprite.position.y = point.y;
  this.sprite.scale.set(point.s);
}

CarRender.prototype.getRelativeZ = function () {
  return this.car.position.z
    - this.raceRender.race.player.position.z
    + this.raceRender.config.cameraDistance;
}

CarRender.prototype.getRelativePosition = function () {
  return {
    x: this.car.position.x,
    y: this.car.position.y,
    z: this.getRelativeZ()
  };
}

module.exports = CarRender;
