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
}

module.exports = BasicCPUControl;
