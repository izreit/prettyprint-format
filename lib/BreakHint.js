// vim: set ts=2 sts=2 sw=2 et ai:

var util = require("./util");
var Fragment = require("./Fragment");

var baseKlass = Fragment;

function BreakHint(formatter, nspaces, offset, hard) {
  baseKlass.call(this, formatter, "BreakHint");
  this.nspaces = nspaces;
  this.offset = offset;
  this.hard = !!hard;
  this.status = BreakHint.Status.UNDETERMINED;
  this.parentBox_ = undefined;
}

var klass = BreakHint;
var proto = klass.prototype = Object.create(baseKlass.prototype, { constructor: { value: klass } });

klass.Status = {
  UNDETERMINED: "UNDETERMINED",
  BREAK: "BREAK",
  NOBREAK: "NOBREAK",
};

proto.appendedTo = function (box) {
  this.parentBox_ = box;
};

proto.setToBreak = function (doBreak) {
  // TODO util.assert(this.status === klass.Status.UNDETERMINED);
  this.status = doBreak ? klass.Status.BREAK : klass.Status.NOBREAK;
};

proto.hasHardBreakHint = function () {
  return this.hard;
};

proto.roomAfterPutHorizontally = function (room) {
  return room - this.nspaces;
};

proto.unshrunkLength = function () {
  return this.nspaces;
};

proto.print = function (boxLeft, startColumn) {
  var ppf = this.formatter_;
  var p = ppf.printFun();

  // TODO util.assert(this.parentBox_);

  if (this.status === klass.Status.BREAK) {
    var indent = boxLeft + this.parentBox_.boxIndent() + this.offset;
    p(ppf.newlineStr() + util.spacer(indent));
  } else {
    p(util.spacer(this.nspaces));
  }
};

module.exports = klass;

