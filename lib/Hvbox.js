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
    return this.formatImpl_(boxLeft, startColumn, false);
  };

  proto.formatImpl_ = function (boxLeft, startColumn, forceToBreak) {
    var limit = this.formatter_.margin() - 1;
    var toBreak = forceToBreak || (this.leftPosAfterPutHorizontally(startColumn, limit) > limit);
    if (toBreak) {
      this.hints_.forEach(function (h) { h.setToBreak(); });
    }

    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      left = this.buf_[i].format(startColumn, left);

      if (!toBreak && this.formatData_.hasSensitiveLineBreak) {
        this.resetFormatData();
        return this.formatImpl_(boxLeft, startColumn, true);
      }
    }
    return left;
  };

  return klass;
})();

module.exports = Hvbox;

