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

  proto.format = function (boxLeft, startColumn) {
    var queue = [];

    function flushQueue(left) {
      for (var i = 0, len = queue.length; i < len; ++i) {
        var frag = queue[i];
        left = frag.format(startColumn, left);
      }
      queue = [];
      return left;
    }

    // According to the section 'Differences between a packing and a structural "hov" box'
    // in https://ocaml.org/learn/tutorials/format.html, the last break hint in a box
    // (structural "hov" box) always breaks the line.  But the result of our tests indicate
    // that the description is not true...  We here disable the behavior by the following flag.
    var ENABLE_STRUCTURAL_BREAK = false;

    var lastHintInBox = (this.hints_.length > 0) ? this.hints_[this.hints_.length - 1] : undefined;
    var limit = this.formatter_.margin() - 1;
    var left = startColumn;
    var right = left;
    var lastHint;

    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      if (frag.kind === "BreakHint") {
        right = left = flushQueue(left);
        lastHint = frag;
      }
      queue.push(frag);
      var hright = frag.leftPosAfterPutHorizontally(right, limit);
      right = hright;

      if (right > limit ||
          (frag.kind === "BreakHint" &&
           (frag.hasHardBreakHint() || this.formatter_.nearestIndent_ > startColumn + this.boxIndent()) ||
           (ENABLE_STRUCTURAL_BREAK && frag === lastHintInBox))) {
        if (lastHint) {
          lastHint.setToBreak();
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

