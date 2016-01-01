// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var Vbox = (function () {
  var baseKlass = BoxBase;
  var klass = Vbox;

  function Vbox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.hasHardBreakHint = function () {
    return this.hints_.length() > 0; // Since any break hint cause a line break in Vbox.
  };

  proto.format = function (boxLeft, startColumn) {
    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      if (frag.kind === "BreakHint")
        frag.setToBreak();
      left = frag.format(startColumn, left);
    }
    return left;
  };

  return klass;
})();

module.exports = Vbox;

