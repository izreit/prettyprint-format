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
  return "HINT: nspaces:" + this.nspaces + " offset:" + this.offset + " hard:" + this.hard + " doBreak_:" + this.doBreak_;
}

proto.appendedTo = function (box) {
  this.parentBox_ = box;
};

proto.setToBreak = function () {
  util.assert(!this.doBreak_);
  this.doBreak_ = true;
};

proto.hasHardBreakHint = function () {
  return this.hard;
};

proto.leftPosAfterPutHorizontally = function (left, limit) {
  return left + this.nspaces;
};

proto.format = function (boxLeft, startColumn) {
  util.assert(this.parentBox_, "BreakHint#format(): must have a parent box.");
  var ppf = this.formatter_;

  if (this.doBreak_) {
    var indent = ppf.clipByMaxIndent_(boxLeft + this.parentBox_.boxIndent() + this.offset);
    ppf.nearestIndent_ = indent;
    return indent;
  } else {
    return startColumn + this.nspaces;
  }
};

proto.print = function (boxLeft, startColumn) {
  util.assert(this.parentBox_, "BreakHint#print(): must have a parent box.");
  var ppf = this.formatter_;
  var printer = ppf.printer();

  if (this.doBreak_) {
    var indent = ppf.clipByMaxIndent_(boxLeft + this.parentBox_.boxIndent() + this.offset);
    printer.outputNewline();
    if (indent > 0)
      printer.outputSpace(indent);
    return indent;
  } else {
    if (this.nspaces > 0)
      printer.outputSpace(this.nspaces);
    return startColumn + this.nspaces;
  }
};

module.exports = klass;

