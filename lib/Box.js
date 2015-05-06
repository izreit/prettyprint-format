// vim: set ts=2 sts=2 sw=2 et ai:

var util = require("./util");
var Fragment = require("./Fragment");

var Box = (function () {
  var baseKlass = Fragment;
  var klass = Box;

  function Box(formatter, additionalIndent, sensitive) {
    additionalIndent || (additionalIndent = 0);
    baseKlass.call(this, formatter, "Box");

    this.additionalIndent_ = additionalIndent;
    this.sensitive_ = !!sensitive;

    this.parentBox_ = undefined;

    this.buf_ = [];
    this.hints_ = [];

    this.hasNewline = false;
    this.cachedLength_ = 0;
    this.lengthDirty_ = true;
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass }
  });

  proto.boxIndent = function () {
    return this.additionalIndent;
  };

  proto.setToBreak = function () {
    // nothing to do.
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

  proto.roomAfterPutHorizontally = function (room) {
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      room = frag.roomAfterPutHorizontally(room);
      if (room < 0)
        return -1;
    }
    return room;
  };

  proto.hasHardBreakHint = function () {
    // TODO should cache the partial result on added
    return util.indexOf(this.buf_, function (frag) {
      return frag.hasHardBreakHint();
    }) != -1;
  };

  proto.shrink = function (boxLeft, startColumn) {
    throw new Error("PureVirtual: Box#shrink");
  };

  proto.print = function (boxLeft, startColumn) {
    if ((this.roomAfterPutHorizontally(this.formatter_.right() - startColumn) < 0)
     || (this.sensitive_ && this.hasHardBreakHint()))
      this.shrink(boxLeft, startColumn);

    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      left = frag.print(boxLeft, left);
    }
    return left;
  };

  return klass;
})();

module.exports = Box;

