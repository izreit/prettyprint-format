// vim: set ts=2 sts=2 sw=2 et ai:

var Hbox = require("./Hbox");
var Vbox = require("./Vbox");
var Hvbox = require("./Hvbox");
var Hovbox = require("./Hovbox");
var Box = require("./Box");
var Text = require("./Text");
var BreakHint = require("./BreakHint");
var Printer = require("./Printer");
var util = require("./util");
var numberToString = require("./numberToString");

function Formatter(opt) {
  opt || (opt = {});

  this.printer_ = new Printer(opt);
  this.margin_ = opt.margin || 80;
  this.maxIndent_ = opt.maxIndent || 0;
  this.boxes_ = [];
  this.rootBox_ = new Hbox(this);

  this.nestCount_ = 0;
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

proto.openBox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  return this.openBoxX_(new Box(this, additionalIndent, sensitive));
};

proto.openHbox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  return this.openBoxX_(new Hbox(this, additionalIndent, sensitive));
};

proto.openVbox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  return this.openBoxX_(new Vbox(this, additionalIndent, sensitive));
};

proto.openHvbox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  return this.openBoxX_(new Hvbox(this, additionalIndent, sensitive));
};

proto.openHovbox = function (additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  return this.openBoxX_(new Hovbox(this, additionalIndent, sensitive));
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
  this.printString(Math.floor(n).toString());
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

proto.forceNewline = function () {
  this.printBreak(0, 0, true);
}

proto.printIfNewline = function () {
  // TODO implement
};

proto.setMargin = function (margin, maxIndent) {
  if (margin && margin >= 2)
    this.margin_ = Math.min(margin, Formatter.MAX_MARGIN);
  if (maxIndent)
    this.setMaxIndent(maxIndent);
};

proto.getMargin = function () {
  return this.margin_;
};

proto.setMaxIndent = function (maxIndent) {
  if (maxIndent && maxIndent >= 2)
    this.maxIndent_ = Math.min(maxIndent, Formatter.MAX_MAX_INDENT);
  if (this.margin_)
    this.maxIndent_ = Math.min(this.maxIndent_, this.margin_);
};

proto.getMaxIndent = function () {
  return this.maxIndent_;
};

proto.printf = function () {
  var format = arguments[0];
  var args = Array.prototype.slice.call(arguments, 1);
  try {
    ++this.nestCount_;
    this.printf_a_(format, args);
  } finally {
    --this.nestCount_;
  }
  if (this.nestCount_ === 0)
    return this.printer_.finish();
  return undefined;
};

proto.currentBox_ = function () {
  var len = this.boxes_.length;
  return len > 0 ? this.boxes_[len - 1] : this.rootBox_;
}

proto.openBoxX_ = function (box) {
  var currentBox = this.currentBox_();
  currentBox.append(box);
  this.boxes_.push(box);
};

proto.clipByMaxIndent_ = function (indent) {
  return (this.maxIndent_ > 0) ? Math.min(indent, this.maxIndent_) : indent;
};

proto.printf_a_ = function (format, args) {
  var s = format.match(/^([^@%]*)/)[0];
  if (s.length > 0)
    this.printString(s);

  var i = 0;
  function nextArg(type) {
    util.assert(i < args.length,
                "Formatter#printf_a_: given " + args.length + " arguments but not enogugh.");
    var ret = args[i++];
    if (typeof type === "string") {
      util.assert(typeof ret === type,
          "Formatter#printf_a_: expected " + type + " but " + (typeof ret)
            + " is given for the " + util.nth(i + 1) + " argument");
    }
    return ret;
  }

  var matched;
  var re = /(?:(@.|@\n)|(?:%([-0+ #]*)([1-9]\d*)?(?:.([1-9]\d*))?(.)))([^@%]*)/g;
  re.lastIndex = s.length;

  while (matched = re.exec(format)) {
    var atX = matched[1];
    var perFlags = matched[2];
    var perWidth = matched[3];
    var perPrec = matched[4];
    var perType = matched[5];
    var trailing = matched[6];

    perWidth = perWidth && Number(perWidth);
    perPrec = perPrec && Number(perPrec);

    if (atX) {
      // we found "@": atX and trailing are not undefined
      switch (atX) {
      case "@[":
        var arg = trailing.match(/^<([a-zA-Z]*)\s*(\d*)>/) || ["", "", ""];
        trailing = trailing.substr(arg[0].length);
        var openers = {
          "": "openBox",
          hv: "openHvbox",
          shv: "openHvbox",
          v: "openVbox",
          h: "openHbox",
          hov: "openHovbox",
        };
        var sensitiveTable = {
          shv: true,
        };
        var opener = openers[arg[1]];
        if (!opener) {
          throw new Error("Fomrater#printf_a_: Unknown box @[" + arg[0] + " :" + arg[1]);
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
      case "@;":
        var arg = trailing.match(/^<(\d*)\s*(\d*)>/) || ["", "", ""];
        if (!(arg[1] && arg[2])) {
          throw new Error("Fomrater#printf_a_: Invalid Format @;" + arg[0]);
        }
        trailing = trailing.substr(arg[0].length);
        this.printBreak(Number(arg[1]), Number(arg[2]));
        break;
      case "@?":
        this.printFlush();
        break;
      case "@\n":
        this.forceNewline();
        break;
      case "@@":
        this.printString("@");
        break;
      default:
        throw new Error("Formatter#printf_a_: unknown escape:" + atX);
      }
    } else if (perType) {
      // we found "%"
      switch (perType) {
      case "d": case "i":
      case "x": case "X": case "o":
      case "f": case "F": case "g": case "G":
        this.printString(numberToString(nextArg("number"), perFlags, perWidth, perPrec, perType));
        break;
      case "s":
        this.printString(nextArg("string"));
        break;
      case "S":
        this.printString(JSON.stringify(nextArg("string")));
        break;
      case "B":
        this.printString(nextArg("boolean").toString());
        break;
      case "a":
        var fun = nextArg("function");
        var arg = nextArg();
        fun(this, arg);
        break;
      case "t":
        var fun = nextArg("function");
        fun(this);
        break;
      case "!":
        this.printFlush();
        break;
      case "%": case "@":
        this.printString(perType);
        break;
      case ",":
        // prints nothing
        break;
      case "A":
        var meth = nextArg("function");
        var obj = nextArg();
        meth.call(obj, this);
        break;
      case "T":
        var obj = nextArg();
        obj.pp(this);
        break;
      case "u": case "c": case "C": // neither unsigned nor characters in JS
      case "l": case "n": case "L": // no int32, nativeint, int64 in JS
      case "b":                     // deprecated
      case "{": case "(":           // ah... actually I don't know how to use them...
        util.assert(false, "Formatter#printf_a_: unsupported escape sequence: %" + perType);
        break;
      default:
        throw new Error("Formatter#printf_a_: unknown escape: %" + perType);
      }
    }
    if (trailing.length > 0)
      this.printString(trailing);
  }
};

module.exports = Formatter;

