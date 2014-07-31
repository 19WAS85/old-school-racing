var Car = function (image) {
  this.image = image;
  this.position = { x: 0, y: 0, z: 0 };
  this.controls = { gas: 0, brake: 0, steering: 0 };
  this.physics = { speed: 0, steering: 0 };
  this.performance = {
    acceleration: 0.04,
    drag: 0.995,
    brake: 0.03,
    steering: 0.02
  };
  this.steeringBackFactor = 0.9;
  this.steeringSpeedFactor = 0.8;
}

Car.prototype.update = function () {
  this.speedControl();
  this.steeringControl();
}

Car.prototype.speedControl = function () {
  this.physics.speed *= this.performance.drag;
  this.physics.speed += this.controls.gas * this.performance.acceleration;
  if (this.physics.speed > 0) {
    this.physics.speed -= this.controls.brake * this.performance.brake;
  }
  this.position.z += this.physics.speed;
}

Car.prototype.steeringControl = function () {
  this.physics.steering *= this.steeringBackFactor;
  this.physics.steering += this.controls.steering * this.performance.steering;
  var steeringFactor = this.physics.speed * this.steeringSpeedFactor
  this.position.x += this.physics.steering * steeringFactor;
}

module.exports = Car;
