var _ = require('underscore');
var Keypress = require('../engine/keypress');

var KeyboardControl = function (car) {
  this.car = car;
  this.listener = new Keypress.keypress.Listener();
  this.bindKeys([
    [
      'a',
      function () { this.car.controls.gas = 1 },
      function () { this.car.controls.gas = 0 }
    ]
  ]);
}

KeyboardControl.prototype.bindKeys = function (keys) {
  _(keys).each(function (keyMap) {
    this.listener.register_combo({
      keys: keyMap[0],
      on_keydown: keyMap[1].bind(this),
      on_keyup: keyMap[2].bind(this),
    });
  }.bind(this));
}

module.exports = KeyboardControl;
