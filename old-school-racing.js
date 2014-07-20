var Car = function (image) {
  this.image = image;
};

var Track = function (name, segments) {
  this.name = name;
  this.segments = segments;
};

var TrackBuilder = function (name) {
  this.name = name;
  this.segments = [];
};

TrackBuilder.prototype.straight = function (length, width, color) {
  for (var i = 0; i < length; i++) {
    var index = this.segments.length;
    this.segments.push([index, 0, width, color]);
  };
};

TrackBuilder.prototype.create = function () {
  return new Track(this.name, this.segments);
};

var Race = function (track, cars) {
  this.track = track;
  this.cars = cars;
}

var Pseudo = function () { }

var RaceRender = function (pseudo, race) {
  this.pseudo = pseudo;
  this.race = race;
}
