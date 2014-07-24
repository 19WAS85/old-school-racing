var RaceRender = function (race, config) {
  var self = this;
  this.race = race;
  this.config = new RenderConfig();
  this.camera = new Camera();
  this.pseudo3d = new Pseudo3D(this.config, this.camera);
  this.objects = this.createRenderObjects();
  this.assets = this.getAssets();
  this.render = new Render(
    this.config,
    this.assets,
    function () { self.update() },
    function () { self.registerObjects() }
  );
}

RaceRender.prototype.update = function () {
  _(this.objects).each(function (o) { o.update() });
}

RaceRender.prototype.createRenderObjects = function () {
  var self = this;
  var objects = [new TrackRender(self, this.race.track)];
  return objects.concat(_(this.race.cars).map(function (car) {
    return new CarRender(self, car);
  }));
}

RaceRender.prototype.getAssets = function () {
  var assets = _(this.objects).map(function (object) {
    if (object.asset) return object.asset;
  });
  return _(assets).compact();
}

RaceRender.prototype.registerObjects = function () {
  var stage = this.render.stage;
  _(this.objects).each(function (object) {
    if (object.sprite) stage.addChild(object.sprite);
  });
}
