var Car = function (image) {
  this.image = image;
  this.position = { x: 0, y: 0, z: 0 };
  this.controls = { gas: 0, brake: 0 };
  this.physics = { speed: 0 };
  this.performance = { acceleration: 0.04, drag: 0.995, brake: 0.03 };
}

Car.prototype.update = function () {
  this.physics.speed *= this.performance.drag;
  this.physics.speed += this.controls.gas * this.performance.acceleration;
  if (this.physics.speed > 0) {
    this.physics.speed -= this.controls.brake * this.performance.brake;
  }
  this.position.z += this.physics.speed;
}

module.exports = Car;
