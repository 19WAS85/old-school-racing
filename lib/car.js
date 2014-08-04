var Car = function (image) {
  this.image = image;
  this.position = { x: 0, y: 0, z: 0 };
  this.controls = { gas: 0, brake: 0, steering: 0 };
  this.physics = { speed: 0, steering: 0, centrifuge: 0 };
  this.performance = {
    acceleration: 0.03,
    drag: 0.999,
    brake: 0.08,
    steering: 0.1,
    steeringLoss: 0.95,
    centrifuge: 0.02,
    centrifugeLoss: 0.955
  };
}

Car.prototype.update = function (segment) {
  this.speedControl(segment);
  this.steeringControl(segment);
}

Car.prototype.speedControl = function (segment) {
  this.physics.speed += this.controls.gas * this.performance.acceleration;
  if (this.physics.speed > 0) {
    this.physics.speed -= this.controls.brake * this.performance.brake;
  }
  this.position.z += this.physics.speed;
  this.physics.speed *= this.performance.drag;
}

Car.prototype.steeringControl = function (segment) {
  this.physics.steering *= this.performance.steeringLoss;
  this.physics.steering += this.controls.steering * this.performance.steering;
  var speedFactor = this.physics.speed / 10;
  this.physics.centrifuge *= this.performance.centrifugeLoss;
  this.physics.centrifuge += segment.curve * this.physics.speed * this.performance.centrifuge;
  this.position.x += (this.physics.steering * speedFactor) + (this.physics.centrifuge * speedFactor);
}

module.exports = Car;
