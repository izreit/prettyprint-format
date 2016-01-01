// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var EllispsisBox = (function () {
  var baseKlass = BoxBase;
  var klass = EllispsisBox;

  function EllispsisBox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.append = function (frag) {
    if (frag.kind !== "Box")
      return;
    baseKlass.prototype.append.call(this, frag);
  };

  proto.leftPosAfterPutHorizontally = function (left, limit) {
    var ell = this.formatter_.getEllipsisText();
    return left + ell.length;
  };

  proto.hasHardBreakHint = function () {
    return false;
  };

  proto.format = function (boxLeft, startColumn) {
    var ell = this.formatter_.getEllipsisText();
    return startColumn + ell.length;
  };

  proto.print_ = function (boxLeft, startColumn) {
    var ell = this.formatter_.getEllipsisText();
    this.formatter_.printer().outputString(ell);
    return startColumn + ell.length;
  };

  return klass;
})();

module.exports = EllispsisBox;
