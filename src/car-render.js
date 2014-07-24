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
  var point = this.raceRender.pseudo3d.projectPoint(this.car.position);
  this.sprite.position.x = point.x;
  this.sprite.position.y = point.y;
  this.sprite.scale.set(point.s);
}
