// vim: set ts=2 sts=2 sw=2 et ai:

var HBox = require("./HBox");
var HVBox = require("./HVBox");
var Text = require("./Text");
var BreakHint = require("./BreakHint");

function Formatter(opt) {
  opt || (opt = {});

  this.printFun_ = opt.printFun;
  this.newlineStr_ = opt.newlineStr || "\n";
  this.margin_ = opt.margin || 80;
  this.maxIndent_ = opt.maxIndent || 0;
  this.columns_ = 0;
  this.boxes_ = [];
  this.rootBox_ = new HBox(this);
}

Formatter.MAX_MARGIN = 1e9;
Formatter.MAX_MAX_INDENT = 1e9;

Formatter.BoxType = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
  HORIZONTAL_VERTICAL: "HORIZONTAL_VERTICAL",
  HORIZONTAL_OR_VERTICAL: "HORIZONTAL_OR_VERTICAL",
  H: "HORIZONTAL",
  V: "VERTICAL",
  HV: "HORIZONTAL_VERTICAL",
  HOV: "HORIZONTAL_OR_VERTICAL",
};

var proto = Formatter.prototype;

proto.printFun = function () { return this.printFun_; };
proto.newlineStr = function () { return this.newlineStr_; };
proto.margin = function () { return this.margin_; };
proto.maxIndent = function () { return this.maxIndent_; };
proto.columns = function () { return this.columns_; };

proto.currentBox_ = function () {
  var len = this.boxes_.length;
  return len > 0 ? this.boxes_[len - 1] : this.rootBox_;
}

proto.openBox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  var newBox = new HVBox(this, additionalIndent, sensitive);
  var currentBox = this.currentBox_();
  currentBox.append(newBox);
  this.boxes_.push(newBox);
};

proto.closeBox = function () {
  this.boxes_.pop();
};

proto.printString = function (s) {
  var frag = new Text(this, s);
  this.currentBox_().append(frag);
};

proto.printInt = function (n) {
};

proto.printNumber = function (n) {
};

proto.printBool = function (b) {
};

proto.printSpace = function () {
  return this.printBreak(1, 0);
};

proto.printCut = function () {
  return this.printBreak(0, 0);
};

proto.printBreak = function (nspaces, offset, hard) {
  var frag = new BreakHint(this, nspaces, offset, hard);
  this.currentBox_().append(frag);
};

proto.printFlush = function () {
  while (this.boxes_.length > 0)
    this.closeBox();
  this.rootBox_.print(0, 0);
};

proto.printNewline = function () {
  this.printFlush();
  this.printFun_(this.newlineStr_);
};

proto.printIfNewline = function () {
};

proto.setMargin = function (margin) {
  this.margin_ = Math.max(Math.min(margin, Formatter.MAX_MARGIN), 2);
};

proto.getMargin = function () {
  return this.margin_;
};

proto.setMaxIndent = function (maxIndent) {
  this.maxIndent_ = Math.max(Math.min(maxIndent, Formatter.MAX_MAX_INDENT), 2);
};

proto.getMaxIndent = function () {
  return this.maxIndent_;
};

module.exports = Formatter;

