// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var Box = (function () {
  var baseKlass = BoxBase;
  var klass = Box;

  function Box(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.print_ = function (boxLeft, startColumn) {
    var ppf_ = this.formatter_;
    var buf_ = this.buf_;
    var self = this;
    var queue = [];

    function flushQueue(left) {
      for (var i = 0, len = queue.length; i < len; ++i) {
        var frag = queue[i];
        left = frag.print(startColumn, left);
      }
      queue = [];
      return left;
    }

    var limit = ppf_.margin() - 1;
    var left = startColumn;
    var right = left;
    var lastHint;

    // box always breaks the last hint
    //this.hints_[this.hints_.length - 1].setToBreak(true);

    for (var i = 0, len = buf_.length; i < len; ++i) {
      var frag = buf_[i];
      if (frag.kind === "BreakHint") {
        right = left = flushQueue(left);
        lastHint = frag;
      }
      queue.push(frag);
      var hright = frag.leftPosAfterPutHorizontally(right, limit);
      if (BoxBase.debugMode)
        console.log("%d->%d\t%s", right, hright, frag.dumpString_());
      right = hright;

      if (right > limit ||
          (frag.kind === "BreakHint" &&
           (frag.hasHardBreakHint() || ppf_.lastPrintedIndent_ > startColumn + this.boxIndent()))) {
        if (lastHint) {
          lastHint.setToBreak(true);
          right = left = flushQueue(left);
          lastHint = undefined;
        }
      }
    }
    left = flushQueue(left);
    return left;
  };

  return klass;
})();

module.exports = Box;

