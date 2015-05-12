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

  proto.print = function (boxLeft, startColumn) {
    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      left = frag.print(boxLeft, left);
    }
    return left;
  };

  return klass;
})();

module.exports = HBox;

