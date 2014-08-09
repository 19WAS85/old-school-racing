var Race = function (track, cars, baseCar) {
  this.track = track;
  this.cars = cars;
  this.baseCar = baseCar || cars[0];
}

module.exports = Race;
