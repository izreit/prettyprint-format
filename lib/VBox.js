// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var VBox = (function () {
  var baseKlass = BoxBase;
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

  proto.print = function (boxLeft, startColumn) {
    boxLeft = startColumn;

    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      if (frag.kind === "BreakHint")
        frag.setToBreak(true);
      left = frag.print(boxLeft, left);
    }
    return left;
  };

  return klass;
})();

module.exports = VBox;

