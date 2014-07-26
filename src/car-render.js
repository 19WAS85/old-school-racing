var CarRender = function (raceRender, car, pseudo3d) {
  this.raceRender = raceRender;
  this.car = car;
  this.asset = car.image;
  this.texture = PIXI.Texture.fromImage(this.asset);
  this.sprite = new PIXI.Sprite(this.texture);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.car.position.rz = this.getRelativeZ();
}

CarRender.prototype.update = function () {
  this.car.position.rz = this.getRelativeZ();
  var position = this.getRelativePosition();
  var point = this.raceRender.pseudo3d.projectPoint(position);
  this.sprite.position.x = point.x;
  this.sprite.position.y = point.y;
  this.sprite.scale.set(point.s);
}

CarRender.prototype.getRelativeZ = function () {
  return this.car.position.z - this.raceRender.race.player.position.z;
}

CarRender.prototype.getRelativePosition = function () {
  return {
    x: this.car.position.x,
    y: this.car.position.y,
    z: this.car.position.rz
  };
}
