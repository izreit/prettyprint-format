// vim: set ts=2 sts=2 sw=2 et ai:

var Box = require("./Box");

var VBox = (function () {
  var baseKlass = Box;
  var klass = VBox;

  function VBox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.hasHardBreakHint = function () {
    return this.hints_.length() > 0; // Since any break hint cause a line break in VBox.
  };

  proto.shrink = function (boxLeft, startColumn) {
    // Nothing to do. VBox always break the lines.
  };

  return klass;
})();

module.exports = VBox;

