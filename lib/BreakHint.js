// vim: set ts=2 sts=2 sw=2 et ai:

var util = require("./util");
var Fragment = require("./Fragment");

var baseKlass = Fragment;

function BreakHint(formatter, nspaces, offset, hard) {
  baseKlass.call(this, formatter, "BreakHint");
  this.nspaces = nspaces;
  this.offset = offset;
  this.hard = !!hard;
  this.doBreak_ = false;
  this.parentBox_ = undefined;
}

var klass = BreakHint;
var proto = klass.prototype = Object.create(baseKlass.prototype, { constructor: { value: klass } });

proto.dumpString_ = function () {
  return "HINT:" + this.nspaces + "/" + this.offset + "/" + this.hard;
}

proto.appendedTo = function (box) {
  this.parentBox_ = box;
};

proto.setToBreak = function (doBreak) {
  // TODO util.assert(!this.doBreak_);
  this.doBreak_ = !!doBreak;
};

proto.hasHardBreakHint = function () {
  return this.hard;
};

proto.leftPosAfterPutHorizontally = function (left, limit) {
  return left + this.nspaces;
};

proto.print = function (boxLeft, startColumn) {
  var ppf = this.formatter_;
  var p = ppf.printFun();

  // TODO util.assert(this.parentBox_);

  if (this.doBreak_) {
    var indent = ppf.clipByMaxIndent(boxLeft + this.parentBox_.boxIndent() + this.offset);
    ppf.lastPrintedIndent_ = indent;
    p(ppf.newlineStr() + util.spacer(indent));
    return indent;
  } else {
    p(util.spacer(this.nspaces));
    return startColumn + this.nspaces;
  }
};

module.exports = klass;

