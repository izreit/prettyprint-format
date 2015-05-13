// vim: set ts=2 sts=2 sw=2 et ai:

var util = require("./util");
var Fragment = require("./Fragment");

var BoxBase = (function () {
  var baseKlass = Fragment;
  var klass = BoxBase;

  function BoxBase(formatter, additionalIndent, sensitive) {
    additionalIndent || (additionalIndent = 0);
    baseKlass.call(this, formatter, "Box");

    this.additionalIndent_ = additionalIndent;
    this.sensitive_ = !!sensitive;

    this.parentBox_ = undefined;

    this.buf_ = [];
    this.hints_ = [];

    this.lastPrintedIndent_ = 0;
    this.hasNewline = false;
    this.cachedLength_ = 0;
    this.lengthDirty_ = true;
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass }
  });

  proto.boxIndent = function () {
    return this.additionalIndent_;
  };

  proto.setToBreak = function () {
    // nothing to do.
  };

  proto.dumpstr = function () {
    return "BOX:" + this.constructor.name;
  };

  proto.appendedTo = function (box) {
    this.parentBox_ = box;
  };

  proto.append = function (frag) {
    this.lengthDirty_ = true;
    this.buf_.push(frag);
    if (frag.kind === "BreakHint")
      this.hints_.push(frag);
    frag.appendedTo(this);
  };

  proto.unshrunkLength = function () {
    if (this.lengthDirty_) {
      this.lengthDirty_ = false;
      this.cachedLength_ = this.buf_.reduce(function (acc, f) { return acc + f.unshrunkLength(); }, 0);
    }
    return this.cachedLength_;
  };

  proto.leftPosAfterPutHorizontally = function (left, limit) {
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      left = frag.leftPosAfterPutHorizontally(left, limit);
      if (left > limit)
        return left;
    }
    return left;
  };

  proto.hasHardBreakHint = function () {
    // TODO should cache the partial result on added
    return util.indexOf(this.buf_, function (frag) {
      return frag.hasHardBreakHint();
    }) != -1;
  };

  proto.print = function (boxLeft, startColumn) {
    throw new Error("PureVirtual: BoxBase#print");
  };

  return klass;
})();

module.exports = BoxBase;

