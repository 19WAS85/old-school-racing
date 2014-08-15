var BasicCPUControl = function (car) {
  this.car = car;
  setInterval(this.update.bind(this), 20);
}

BasicCPUControl.prototype.update = function () {
  if (this.car.position.x > 0) {
    this.car.controls.steering = -1;
  } else {
    this.car.controls.steering = 1;
  }
  if (Math.abs(this.car.dynamics.centrifuge) < 1) {
    this.car.controls.gas = 1;
    this.car.controls.brake = 0;
  } else {
    this.car.controls.gas = 0;
    this.car.controls.brake = 1;
  }
}

module.exports = BasicCPUControl;
