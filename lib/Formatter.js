// vim: set ts=2 sts=2 sw=2 et ai:

var Hbox = require("./Hbox");
var Vbox = require("./Vbox");
var Hvbox = require("./Hvbox");
var Hovbox = require("./Hovbox");
var Box = require("./Box");
var EllipsisBox = require("./EllipsisBox");
var Text = require("./Text");
var BreakHint = require("./BreakHint");
var Printer = require("./Printer");
var util = require("./util");
var numberToString = require("./numberToString");

function Formatter(opt) {
  opt || (opt = {});

  this.printer_ = new Printer(opt);
  this.margin_ = 80;
  this.maxIndent_ = 0;
  this.maxBoxes_ = 0;
  this.ellipsisText_ = ".";
  this.boxes_ = [];
  this.rootBox_ = new Hbox(this);
  this.debugDumpOnFlush_ = !!opt.debugDumpOnFlush;

  this.nestCount_ = 0;

  if (opt.margin != null)
    this.setMargin(opt.margin, opt.maxIndent);
  if (opt.maxBoxes != null)
    this.setMaxBoxes(opt.maxBoxes);
  if (opt.ellipsisText != null)
    this.setEllipsisText(opt.ellipsisText);
}

Formatter.MAX_MARGIN = 1e9;
Formatter.MAX_MAX_INDENT = 1e9;

// It seems that OCaml considers we always open two boxes.
// Cannot understand why, but we follow them...
var BOX_NESTING_LEVEL_OCAML_OFFSET = 2;

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
  return this.openBoxX_(Box, additionalIndent, sensitive);
};

proto.openHbox = function (additionalIndent, sensitive) {
  return this.openBoxX_(Hbox, additionalIndent, sensitive);
};

proto.openVbox = function (additionalIndent, sensitive) {
  return this.openBoxX_(Vbox, additionalIndent, sensitive);
};

proto.openHvbox = function (additionalIndent, sensitive) {
  return this.openBoxX_(Hvbox, additionalIndent, sensitive);
};

proto.openHovbox = function (additionalIndent, sensitive) {
  return this.openBoxX_(Hovbox, additionalIndent, sensitive);
};

proto.closeBox = function () {
  this.boxes_.pop();
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
  this.flush_(false);
};

proto.printNewline = function () {
  this.flush_(true);
};

proto.forceNewline = function () {
  this.printBreak(0, 0, true);
}

proto.printIfNewline = function () {
  // TODO implement
};

proto.setMargin = function (margin, maxIndent) {
  if (margin >= 2)
    this.margin_ = Math.min(margin, Formatter.MAX_MARGIN);
  if (maxIndent != null)
    this.setMaxIndent(maxIndent);
};

proto.getMargin = function () {
  return this.margin_;
};

proto.setMaxIndent = function (maxIndent) {
  if (maxIndent === 0 || maxIndent >= 2)
    this.maxIndent_ = Math.min(maxIndent, Formatter.MAX_MAX_INDENT);
};

proto.getMaxIndent = function () {
  return this.maxIndent_;
};

proto.setMaxBoxes = function (maxBoxes) {
  if (maxBoxes <= 2)
    return;
  this.maxBoxes_ = maxBoxes;
};

proto.getMaxBoxes = function () {
  return this.maxBoxes_;
};

proto.overMaxBoxes = function () {
  if (this.maxBoxes_ <= 2)
    return false;
  return this.maxBoxes_ <= this.boxes_.length + BOX_NESTING_LEVEL_OCAML_OFFSET;
};

proto.setEllipsisText = function (ellipsisText) {
  this.ellipsisText_ = ellipsisText;
};

proto.getEllipsisText = function () {
  return this.ellipsisText_;
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
  return (this.nestCount_ === 0 && this.boxes_.length === 0) ? this.finishPrint() : undefined;
};

proto.finishPrint = function () {
  if (this.nestCount_ !== 0)
    throw new Error("Formatter#finishPrint(): Still open "
                     + this.nestCount_ + " boxes. cannot finish until the all box closed.");
  if (this.rootBox_.buf_.length !== 0)  // Ugh! dirty way to determine whether or not already flushed
    this.flush_(false);
  return this.printer_.finish();
};

proto.printObject = function (ppf, o) {
  function pp_arr(ppf, o) {
    for (var i = 0; i < o.length - 1; ++i)
      ppf.printf("@[<hv>%a@],@ ", ppv, o[i]);
    ppf.printf("@[<hv>%a@]", ppv, o[i]);
  }
  function pp_obj(ppf, o) {
    var ks = Object.keys(o);
    for (var i = 0; i < ks.length - 1; ++i)
      ppf.printf("@[<hv>\"%s\": %a@],@ ", ks[i], ppv, o[ks[i]]);
    ppf.printf("@[<hv>\"%s\": %a@]", ks[i], ppv, o[ks[i]]);
  }
  function ppv(ppf, o) {
    if (o === undefined) {
      ppf.printf("null");
    } else if (typeof o !== "object" || o === null) {
      ppf.printf("%s", JSON.stringify(o));
    } else if (o instanceof Array) {
      if (o.length > 0)
        ppf.printf("[@;<1 2>@[<hov>%a@]@ ]", pp_arr, o);
      else
        ppf.printf("[]");
    } else {
      if (Object.keys(o).length > 0)
        ppf.printf("{@;<1 2>@[<hv>%a@]@ }", pp_obj, o);
      else
        ppf.printf("{}");
    }
  }
  return ppf.printf("@[<hv>%a@]", ppv, o);
};

proto.currentBox_ = function () {
  var len = this.boxes_.length;
  return len > 0 ? this.boxes_[len - 1] : this.rootBox_;
}

proto.openBoxX_ = function (boxClass, additionalIndent, sensitive) {
  additionalIndent || (additionalIndent = 0);
  if (this.overMaxBoxes())
    boxClass = EllipsisBox;
  var box = new boxClass(this, additionalIndent, sensitive);
  var currentBox = this.currentBox_();
  currentBox.append(box);
  this.boxes_.push(box);
};

proto.clipByMaxIndent_ = function (indent) {
  return (this.maxIndent_ > 0) ? Math.min(indent, this.maxIndent_) : indent;
};

proto.flush_ = function (addNewline) {
  while (this.boxes_.length > 0)
    this.closeBox();
  this.rootBox_.format(0, 0);
  if (this.debugDumpOnFlush_)
    console.log(this.rootBox_.debugDump_(0));
  this.rootBox_.print(0, 0);
  if (addNewline)
    this.printer_.outputNewline();
  this.printer_.outputFlush();
  this.rootBox_.clear();
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
  var re = /(?:(@.|@\n)|(?:%([-0+ #]*)([\*]|[1-9]\d*)?(?:.([\*]|[1-9]\d*))?(.)))([^@%]*)/g;
  re.lastIndex = s.length;

  while (matched = re.exec(format)) {
    var atX = matched[1];
    var perFlags = matched[2];
    var perWidth = matched[3];
    var perPrec = matched[4];
    var perType = matched[5];
    var trailing = matched[6];

    if (atX) {
      // we found "@": atX and trailing are not undefined
      switch (atX) {
      case "@[":
        var arg = trailing.match(/^<([a-zA-Z]*)\s*(\d*)>/) || ["", "", ""];
        trailing = trailing.substr(arg[0].length);
        var openers = {
          "": "openBox",
          hv: "openHvbox",
          v: "openVbox",
          h: "openHbox",
          hov: "openHovbox",
          shv: "openHvbox",  // TODO document shvbox
        };
        var sensitiveTable = {
          shv: true,
        };
        var opener = openers[arg[1]];
        if (!opener) {
          throw new Error("Fomrater#printf_a_: Unknown box @[" + arg[0] + " :" + arg[1]);
        }
        var additionalIndent = Number(arg[2]) || 0;
        this[opener](additionalIndent, !!sensitiveTable[arg[1]]);
        break;
      case "@]":
        this.closeBox();
        break;
      case "@.":
        this.printNewline();
        break;
      case "@ ":
        this.printSpace();
        break;
      case "@,":
        this.printCut();
        break;
      case "@;":
        var arg = trailing.match(/^<(\d*)\s*(\d*)>/) || ["", "", ""];
        var nspaces, offset;
        if (!(arg[1] && arg[2])) {
          nspaces = 1;
          offset = 0;
        } else {
          nspaces = Number(arg[1]);
          offset = Number(arg[2]);
        }
        trailing = trailing.substr(arg[0].length);
        this.printBreak(nspaces, offset);
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
      if (perWidth)
        perWidth = (perWidth !== "*") ? Number(perWidth) : nextArg("number");
      if (perPrec)
        perPrec = (perPrec !== "*") ? Number(perPrec) : nextArg("number");

      switch (perType) {
      case "d": case "i":
      case "x": case "X": case "o":
      case "e": case "E": case "f": case "F": case "g": case "G":
        this.printString(numberToString(nextArg("number"), perFlags, perWidth, perPrec, perType));
        break;
      case "s": case "S":
        var s = nextArg("string");
        if (perType === "S")
          s = JSON.stringify(s);
        if (perWidth)
          s = util.fillAtLeast(perWidth, s, perFlags.indexOf("-") !== -1);
        this.printString(s);
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
