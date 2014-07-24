var RaceRender = function (race, config) {
  this.race = race;
  this.config = new RenderConfig();
  this.camera = new Camera();
  this.pseudo3d = new Pseudo3D(this.config, this.camera);
  this.objects = this.createRenderObjects();
  this.assets = this.getAssets();
  this.render = new Render(
    this.config,
    this.assets,
    this.registerObjects.bind(this),
    this.update.bind(this)
  );
}

RaceRender.prototype.update = function () {
  _(this.objects).each(function (o) { o.update() });
}

RaceRender.prototype.createRenderObjects = function () {
  var trackRender = new TrackRender(this, this.race.track);
  var carsRender = _(this.race.cars).map(function (car) {
    return new CarRender(this, car);
  }.bind(this));
  return [trackRender].concat(carsRender);
}

RaceRender.prototype.registerObjects = function () {
  _(this.objects).each(function (object) {
    if (object.sprite) this.render.stage.addChild(object.sprite);
  }.bind(this));
}

RaceRender.prototype.getAssets = function () {
  var objectsList = _.chain(this.objects);
  return objectsList.map(function (o) { return o.asset }).compact().value();
}
