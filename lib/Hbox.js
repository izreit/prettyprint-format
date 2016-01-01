// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var Hbox = (function () {
  var baseKlass = BoxBase;
  var klass = Hbox;

  function Hbox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.hasHardBreakHint = function () {
    return false; // Nobody break the line in hbox, even they are hard.
  };

  proto.format = function (boxLeft, startColumn) {
    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      left = frag.format(boxLeft, left);
    }
    return left;
  };

  return klass;
})();

module.exports = Hbox;

