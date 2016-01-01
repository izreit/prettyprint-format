// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var Hvbox = (function () {
  var baseKlass = BoxBase;
  var klass = Hvbox;

  function Hvbox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.format = function (boxLeft, startColumn) {
    var limit = this.formatter_.margin() - 1;
    if (this.leftPosAfterPutHorizontally(startColumn, limit) > limit) {
      this.hints_.forEach(function (h) { h.setToBreak(); });
    }

    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      left = this.buf_[i].format(startColumn, left);
    }
    return left;
  };

  return klass;
})();

module.exports = Hvbox;

