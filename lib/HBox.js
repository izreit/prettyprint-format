// vim: set ts=2 sts=2 sw=2 et ai:

var Box = require("./Box");

var HBox = (function () {
  var baseKlass = Box;
  var klass = HBox;

  function HBox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.hasHardBreakHint = function () {
    return false; // Nobody break the line in hbox, even they are hard.
  };

  proto.shrink = function (boxLeft, startColumn) {
    // Nothing to do. hbox never break the lines.
  };

  return klass;
})();

module.exports = HBox;

