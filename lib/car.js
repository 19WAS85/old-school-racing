var _ = require('underscore');

var Car = function (image, performance) {
  this.image = image;
  this.position = { x: 0, y: 0, z: 0 };
  this.controls = { gas: 0, brake: 0, steering: 0 };
  this.dynamics = { speed: 0, steering: 0, centrifuge: 0 };
  this.physics = this.createPhysics(performance);
}

Car.prototype.update = function (segment) {
  this.speedControl(segment);
  this.steeringControl(segment);
  this.centrifugeControl(segment);
}

Car.prototype.speedControl = function (segment) {
  this.dynamics.speed *= this.physics.drag;
  this.dynamics.speed += this.getAccelerationFactor();
  this.dynamics.speed += this.getBrakingFactor();
  this.position.z += this.dynamics.speed;
}

Car.prototype.steeringControl = function (segment) {
  this.dynamics.steering *= this.physics.steeringLoss;
  this.dynamics.steering += this.getSteeringFactor();
  this.position.x += this.dynamics.steering;
}

Car.prototype.centrifugeControl = function (segment) {
  this.dynamics.centrifuge *= this.physics.centrifugeLoss;
  this.dynamics.centrifuge += this.getCentrifugeFactor(segment);
  this.position.x += this.dynamics.centrifuge;
}

Car.prototype.getAccelerationFactor = function () {
  return this.controls.gas * this.physics.acceleration;
}

Car.prototype.getBrakingFactor = function () {
  return -(this.controls.brake * this.physics.brake);
}

Car.prototype.getSteeringFactor = function () {
  return this.controls.steering * this.physics.steering * this.getSpeedMod();
}

Car.prototype.getCentrifugeFactor = function (segment) {
  var centrifugeFactor = this.dynamics.speed * this.physics.centrifuge;
  return segment.curve * centrifugeFactor * this.getSpeedMod();
}

Car.prototype.getSpeedMod = function () {
  return this.dynamics.speed / 10;
}

Car.prototype.createPhysics = function (performance) {
  var defaultPerformance = { engine: 0.5, brake: 0.5, grip: 0.5 };
  performance = _(defaultPerformance).extend(performance);
  var physics = {
    drag: 0.998,
    acceleration: 0.05,
    brake: 0.08,
    steering: 0.15,
    steeringLoss: 0.95,
    centrifuge: 0.03,
    centrifugeLoss: 0.955
  };
  physics.acceleration *= performance.engine;
  physics.brake *= performance.brake;
  physics.steering *= performance.grip;
  return physics;
}

module.exports = Car;
