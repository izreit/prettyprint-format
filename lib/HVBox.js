// vim: set ts=2 sts=2 sw=2 et ai:

var Box = require("./Box");

var HVBox = (function () {
  var baseKlass = Box;
  var klass = HVBox;

  function HVBox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.print = function (boxLeft, startColumn) {
    var limit = this.formatter_.margin() - 1;
    if ((this.leftPosAfterPutHorizontally(startColumn, limit) >= limit) ||
        (this.sensitive_ && this.hasHardBreakHint())) {
      this.hints_.forEach(function (h) { h.setToBreak(true); });
    }

    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      var lleft = frag.print(startColumn, left);
      console.log(left + "->" + lleft + "\t" + frag.dumpstr());
      left = lleft;
    }
    return left;
  };


  return klass;
})();

module.exports = HVBox;

