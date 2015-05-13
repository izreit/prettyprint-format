// vim: set ts=2 sts=2 sw=2 et ai:

var Fragment = (function () {
  var klass = Fragment;

  function Fragment(formatter, kind) {
    this.formatter_ = formatter;
    this.kind = kind;
  }

  var proto = klass.prototype;

  proto.appendedTo = function (box) {
    throw new Error("PureVirtual: Fragment#appendedTo");
  };

  proto.setToBreak = function (box) {
    throw new Error("PureVirtual: Fragment#setToBreak");
  };

  proto.hasHardBreakHint = function () {
    throw new Error("PureVirtual: Fragment#hasHardBreakHint");
  };

  proto.leftPosAfterPutHorizontally = function (left, limit) {
    throw new Error("PureVirtual: Fragment#leftPosAfterPutHorizontally");
  };

  proto.print = function (boxLeft, startColumn) {
    throw new Error("PureVirtual: Fragment#layout");
  };

  return klass;
})();

module.exports = Fragment;

