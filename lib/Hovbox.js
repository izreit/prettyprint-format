// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var Hovbox = (function () {
  var baseKlass = BoxBase;
  var klass = Hovbox;

  function Hovbox(formatter, additionalIndent, sensitive) {
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
           frag.hasHardBreakHint())) {
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

module.exports = Hovbox;

