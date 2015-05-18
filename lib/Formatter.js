// vim: set ts=2 sts=2 sw=2 et ai:

var HBox = require("./HBox");
var VBox = require("./VBox");
var HVBox = require("./HVBox");
var HOVBox = require("./HOVBox");
var Box = require("./Box");
var Text = require("./Text");
var BreakHint = require("./BreakHint");
var Printer = require("./Printer");
var util = require("./util");

function Formatter(opt) {
  opt || (opt = {});

  this.printer_ = Printer.makeStringPrinter(opt);

  this.margin_ = opt.margin || 80;
  this.maxIndent_ = opt.maxIndent || 0;
  this.columns_ = 0;
  this.boxes_ = [];
  this.rootBox_ = new HBox(this);
}

Formatter.MAX_MARGIN = 1e9;
Formatter.MAX_MAX_INDENT = 1e9;

var proto = Formatter.prototype;

proto.setOutHandlers = function (outHandlers) {
  this.printer_ = new Printer(outHandlers);
};

proto.getOutHandlers = function () {
  throw "getOutHandlers";
};

proto.printer = function () { return this.printer_; };
proto.margin = function () { return this.margin_; };
proto.maxIndent = function () { return this.maxIndent_; };
proto.columns = function () { return this.columns_; };

proto.currentBox_ = function () {
  var len = this.boxes_.length;
  return len > 0 ? this.boxes_[len - 1] : this.rootBox_;
}

proto.openBoxX_ = function (box) {
  var currentBox = this.currentBox_();
  currentBox.append(box);
  this.boxes_.push(box);
};

proto.openBox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  return this.openBoxX_(new Box(this, additionalIndent, sensitive));
};

proto.openHBox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  return this.openBoxX_(new HBox(this, additionalIndent, sensitive));
};

proto.openVBox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  return this.openBoxX_(new VBox(this, additionalIndent, sensitive));
};

proto.openHVBox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  return this.openBoxX_(new HVBox(this, additionalIndent, sensitive));
};

proto.openHOVBox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  return this.openBoxX_(new HOVBox(this, additionalIndent, sensitive));
};

proto.flush_ = function () {
  this.rootBox_.print(0, 0);
  this.rootBox_.clear();
  this.printer_.outputFlush();
};

proto.closeBox = function () {
  this.boxes_.pop();
  if (this.boxes_.length === 0)
    this.flush_();
};

proto.printString = function (s) {
  var frag = new Text(this, s);
  this.currentBox_().append(frag);
};

proto.printInt = function (n) {
  this.printString(n.toString());
};

proto.printNumber = function (n) {
  this.printString(n.toString());
};

proto.printBool = function (b) {
  this.printString(n.toString());
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
  this.flush_();
};

proto.printNewline = function () {
  this.printFlush();
  this.printer_.outputNewline();
};

proto.printIfNewline = function () {
  // TODO implement
};

proto.setMargin = function (margin, maxIndent) {
  // This is the setter for the margin value but also takes another argument
  // to set the max indent value... this is not clean but intentional.
  // 
  // Unlike OCaml Format module, we don't provide the independent setter
  // for the max indent value because it is always related to the margin.
  // Format.set_margin in OCaml modifies implicitly the max indent value
  // in non-trivial, non-documented way but we don't want to emulate that
  // ad-hoc and cryptic behaviour...

  if (margin && margin >= 2)
    this.margin_ = Math.min(margin, Formatter.MAX_MARGIN);
  if (maxIndent && maxIndent >= 2)
    this.maxIndent_ = Math.min(maxIndent, Formatter.MAX_MAX_INDENT);
};

proto.getMargin = function () {
  return this.margin_;
};

proto.getMaxIndent = function () {
  return this.maxIndent_;
};

proto.clipByMaxIndent = function (indent) {
  return (this.maxIndent_ > 0) ? Math.min(indent, this.maxIndent_) : indent;
};

proto.printf_a = function (format, args) {
  var s = format.match(/^([^@%]*)/)[0];
  if (s.length > 0)
    this.printString(s);

  var i = 0;
  var matched;
  var re = /([@%].)([^@%]*)/g;
  re.lastIndex = s.length;

  while (matched = re.exec(format)) {
    var eseq = matched[1];
    var trailing = matched[2];
    if (eseq) {
      switch (eseq) {
      case "@[":
        var arg = trailing.match(/^<([a-zA-Z]*)\s*(\d*)>/) || ["", "", ""];
        trailing = trailing.substr(arg[0].length);
        var openers = {
          "": "openBox",
          hv: "openHVBox",
          shv: "openHVBox",
          v: "openVBox",
          h: "openHBox",
          hov: "openHOVBox",
        };
        var sensitiveTable = {
          shv: true,
        };
        var opener = openers[arg[1]];
        if (!opener) {
          throw new Error("Fomrater#printf_a: Unknown box @[" + arg[0] + " :" + arg[1]);
        }
        var additionalIndent = Number(arg[2]) || 0;
        this[opener](additionalIndent, !!sensitiveTable[opener]);
        break;
      case "@]":
        this.closeBox();
        break;
      case "@.":
        this.printFlush();
        break;
      case "@ ":
        this.printSpace();
        break;
      case "@,":
        this.printCut();
        break;
      case "@:":
      case "@;":
        var arg = trailing.match(/^<(\d*)\s*(\d*)>/) || ["", "", ""];
        if (!(arg[1] && arg[2])) {
          throw new Error("Fomrater#printf_a: Invalid Format @;" + arg[0]);
        }
        trailing = trailing.substr(arg[0].length);
        this.printBreak(Number(arg[1]), Number(arg[2]), eseq === "@:");
        break;
      case "%a":
        var fun = args[i++];
        var arg = args[i++];
        fun(this, arg);
        break;
      case "%t":
        var fun = args[i++];
        fun(this);
        break;
      case "%m":
        var meth = args[i++];
        var obj = args[i++];
        meth.call(obj, this);
        break;
      case "%o":
        var obj = args[i++];
        obj.pp(this);
        break;
      case "%i":
        this.printInt(args[i++]);
        break;
      case "%s":
        var str = args[i++];
        util.assert(typeof str === "string", "Formatter#printf_a: %s requires a string.");
        this.printString(str);
        break;
      default:
        throw new Error("Formatter#printf_a: unknown escape:" + matched[1]);
      }
    }
    if (trailing.length > 0)
      this.printString(trailing);
  }
};

proto.printf = function (format, args___) {
  var args = Array.prototype.slice.call(arguments, 1);
  this.printf_a(format, args);
};

proto.sprintf = function (format, args___) {
  var args = Array.prototype.slice.call(arguments, 1);
  this.printf_a(format, args);
  return this.printer_.getResult();
};

module.exports = Formatter;

