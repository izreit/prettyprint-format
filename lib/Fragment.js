// vim: set ts=2 sts=2 sw=2 et ai:

var util = require("./util");

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

  proto.resetFormatData = function () {
    throw new Error("PureVirtual: Fragment#resetFormatData");
  };

  proto.setToBreak = function () {
    throw new Error("PureVirtual: Fragment#setToBreak");
  };

  proto.hasHardBreakHint = function () {
    throw new Error("PureVirtual: Fragment#hasHardBreakHint");
  };

  proto.leftPosAfterPutHorizontally = function (left, limit) {
    throw new Error("PureVirtual: Fragment#leftPosAfterPutHorizontally");
  };

  proto.format = function (boxLeft, startColumn) {
    throw new Error("PureVirtual: Fragment#format");
  };

  proto.print = function (boxLeft, startColumn) {
    throw new Error("PureVirtual: Fragment#print");
  };

  proto.dumpString_ = function () {
    throw new Error("PureVirtual: Fragment#dumpString_");
  };

  proto.debugDump_ = function (indentDepth) {
    return util.spacer(indentDepth) + this.dumpString_();
  };

  return klass;
})();

module.exports = Fragment;

