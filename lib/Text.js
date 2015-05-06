// vim: set ts=2 sts=2 sw=2 et ai:

var util = require("./util");
var Fragment = require("./Fragment");

var baseKlass = Fragment;

function Text(formatter, content) {
  baseKlass.call(this, formatter, "Text");
  this.content = content;
}

var klass = Text;
var proto = klass.prototype = Object.create(baseKlass.prototype, { constructor: { value: klass } });

proto.appendedTo = function (box) {
  // nothing to do.
};

proto.setToBreak = function (box) {
  // nothing to do.
};

proto.hasHardBreakHint = function () {
  return false;
};

proto.roomAfterPutHorizontally = function (room) {
  return room - this.content.length;
};

proto.unshrunkLength = function () {
  return this.content.length;
};

proto.print = function (boxLeft, startColumn) {
  var p = this.formatter_.printFun();
  p(this.content);
  return startColumn + this.content.length;
};

module.exports = klass;


