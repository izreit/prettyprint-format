(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Format = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

module.exports = require("./lib/Format");

},{"./lib/Format":6}],2:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var Box = (function () {
  var baseKlass = BoxBase;
  var klass = Box;

  function Box(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.format = function (boxLeft, startColumn) {
    var queue = [];

    function flushQueue(left) {
      for (var i = 0, len = queue.length; i < len; ++i) {
        var frag = queue[i];
        left = frag.format(startColumn, left);
      }
      queue = [];
      return left;
    }

    // According to the section 'Differences between a packing and a structural "hov" box'
    // in https://ocaml.org/learn/tutorials/format.html, the last break hint in a box
    // (structural "hov" box) always breaks the line.  But the result of our tests indicate
    // that the description is not true...  We here disable the behavior by the following flag.
    var ENABLE_STRUCTURAL_BREAK = false;

    var lastHintInBox = (this.hints_.length > 0) ? this.hints_[this.hints_.length - 1] : undefined;
    var limit = this.formatter_.margin() - 1;
    var left = startColumn;
    var right = left;
    var lastHint;

    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      if (frag.kind === "BreakHint") {
        right = left = flushQueue(left);
        lastHint = frag;
      }
      queue.push(frag);
      var hright = frag.leftPosAfterPutHorizontally(right, limit);
      right = hright;

      if (right > limit ||
          (frag.kind === "BreakHint" &&
           (frag.hasHardBreakHint() || this.formatter_.nearestIndent_ > startColumn + this.boxIndent()) ||
           (ENABLE_STRUCTURAL_BREAK && frag === lastHintInBox))) {
        if (lastHint) {
          lastHint.setToBreak();
          right = left = flushQueue(left);
          lastHint = undefined;
        }
      }
    }
    left = flushQueue(left);
    return left;
  };

  return klass;
})();

module.exports = Box;


},{"./BoxBase":3}],3:[function(require,module,exports){
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

    this.formatData_ = {
      hasLineBreak: false,
      hasSensitiveLineBreak: false
    };

    this.parentBox_ = undefined;
    this.nearestIndent_ = 0;
    this.buf_ = [];
    this.hints_ = [];
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

  proto.appendedTo = function (box) {
    this.parentBox_ = box;
  };

  proto.append = function (frag) {
    this.buf_.push(frag);
    if (frag.kind === "BreakHint")
      this.hints_.push(frag);
    frag.appendedTo(this);
  };

  proto.clear = function () {
    this.parentBox_ = undefined;
    this.nearestIndent_ = 0;
    this.buf_ = [];
    this.hints_ = [];
    this.resetFormatData();
  };

  proto.resetFormatData = function () {
    this.formatData_ = {
      hasLineBreak: false,
      hasSensitiveLineBreak: false
    };
    this.buf_.forEach(function (c) { c.resetFormatData(); });
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

  proto.notifyLineBreak = function () {
    if (this.formatData_.hasLineBreak)
      return;
    this.formatData_.hasLineBreak = true;
    if (this.sensitive_)
      this.formatData_.hasSensitiveLineBreak = true;
    if (this.parentBox_)
      this.parentBox_.notifyLineBreak();
  };

  proto.format = function (boxLeft, startColumn) {
    throw new Error("PureVirtual: BoxBase#format");
  };

  proto.print = function (boxLeft, startColumn) {
    var printer = this.formatter_.printer();
    printer.outputDebugString("<");
    var ret = this.print_(boxLeft, startColumn);
    printer.outputDebugString(">");
    return ret;
  };

  proto.print_ = function (boxLeft, startColumn) {
    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i)
      left = this.buf_[i].print(startColumn, left);
    return left;
  };

  proto.dumpString_ = function () {
    return this.constructor.name;
  };

  proto.debugDump_ = function (indentDepth) {
    var indent = util.spacer(indentDepth);
    var childrenDump = this.buf_.map(function (c) { return c.debugDump_(indentDepth + 2); });
    return (indent + this.dumpString_()) + "\n" + childrenDump.join("\n");
  };

  return klass;
})();

module.exports = BoxBase;


},{"./Fragment":8,"./util":16}],4:[function(require,module,exports){
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

proto.resetFormatData = function () {
  this.doBreak_ = false;
};

proto.setToBreak = function () {
  util.assert(this.parentBox_, "must have the parent box.");
  util.assert(!this.doBreak_, "must not called twice without reset.");
  this.doBreak_ = true;

  this.parentBox_.notifyLineBreak();
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


},{"./Fragment":8,"./util":16}],5:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var EllispsisBox = (function () {
  var baseKlass = BoxBase;
  var klass = EllispsisBox;

  function EllispsisBox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.append = function (frag) {
    if (frag.kind !== "Box")
      return;
    baseKlass.prototype.append.call(this, frag);
  };

  proto.leftPosAfterPutHorizontally = function (left, limit) {
    var ell = this.formatter_.getEllipsisText();
    return left + ell.length;
  };

  proto.hasHardBreakHint = function () {
    return false;
  };

  proto.format = function (boxLeft, startColumn) {
    var ell = this.formatter_.getEllipsisText();
    return startColumn + ell.length;
  };

  proto.print_ = function (boxLeft, startColumn) {
    var ell = this.formatter_.getEllipsisText();
    this.formatter_.printer().outputString(ell);
    return startColumn + ell.length;
  };

  return klass;
})();

module.exports = EllispsisBox;

},{"./BoxBase":3}],6:[function(require,module,exports){
(function (global){
// vim: set ts=2 sts=2 sw=2 et ai:

var Formatter = require("./Formatter");
var BoxBase = require("./BoxBase");

function stringify(o, opt) {
  if (typeof opt === "number")
    opt = { margin: opt };
  var ppf = new Formatter(opt);
  return ppf.printf("%a%!", ppf.printObject, o);
}

var DEFAULT_MARGIN = (function () {
  try {
    return global.process.stdout.columns;
  } catch (e) {
    return 78;
  }
})();

function stdFormatterFun(n) {
  return function () {
    var ppf = Format.stdFormatter;
    return ppf[n].apply(ppf, arguments);
  };
}

function strFormatterFun(n) {
  return function () {
    var ppf = Format.strFormatter;
    return ppf[n].apply(ppf, arguments);
  };
}

var Format = {
  Formatter: Formatter,
  DEFAULT_MARGIN: DEFAULT_MARGIN,

  stdFormatter: new Formatter({
    margin: DEFAULT_MARGIN,
    maxIndent: 0,
    onFinish: function (s) { console.log(s); },
  }),

  strFormatter: new Formatter({
    margin: DEFAULT_MARGIN,
    maxIndent: 0,
  }),

  printf: stdFormatterFun("printf"),
  sprintf: strFormatterFun("printf"),

  setMargin: stdFormatterFun("setMargin"),
  getMargin: stdFormatterFun("getMargin"),
  setMaxIndent: stdFormatterFun("setMaxIndent"),
  getMaxIndent: stdFormatterFun("getMaxIndent"),

  setStrMargin: strFormatterFun("setMargin"),
  getStrMargin: strFormatterFun("getMargin"),
  setStrMaxIndent: strFormatterFun("setMaxIndent"),
  getStrMaxIndent: strFormatterFun("getMaxIndent"),

  stringify: stringify,
};

module.exports = Format;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./BoxBase":3,"./Formatter":7}],7:[function(require,module,exports){
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

},{"./Box":2,"./BreakHint":4,"./EllipsisBox":5,"./Hbox":9,"./Hovbox":10,"./Hvbox":11,"./Printer":12,"./Text":13,"./Vbox":14,"./numberToString":15,"./util":16}],8:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

var util = require("./util");

var Fragment = (function () {
  var klass = Fragment;

  function Fragment(formatter, kind) {
    this.formatter_ = formatter;
    this.kind = kind;
  }

  var proto = klass.prototype;

  proto.appendedTo = function (box) {
    throw new Error("PureVirtual: Fragment#appendedTo");
  };

  proto.resetFormatData = function () {
    throw new Error("PureVirtual: Fragment#resetFormatData");
  };

  proto.setToBreak = function () {
    throw new Error("PureVirtual: Fragment#setToBreak");
  };

  proto.hasHardBreakHint = function () {
    throw new Error("PureVirtual: Fragment#hasHardBreakHint");
  };

  proto.leftPosAfterPutHorizontally = function (left, limit) {
    throw new Error("PureVirtual: Fragment#leftPosAfterPutHorizontally");
  };

  proto.format = function (boxLeft, startColumn) {
    throw new Error("PureVirtual: Fragment#format");
  };

  proto.print = function (boxLeft, startColumn) {
    throw new Error("PureVirtual: Fragment#print");
  };

  proto.dumpString_ = function () {
    throw new Error("PureVirtual: Fragment#dumpString_");
  };

  proto.debugDump_ = function (indentDepth) {
    return util.spacer(indentDepth) + this.dumpString_();
  };

  return klass;
})();

module.exports = Fragment;


},{"./util":16}],9:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var Hbox = (function () {
  var baseKlass = BoxBase;
  var klass = Hbox;

  function Hbox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.hasHardBreakHint = function () {
    return false; // Nobody break the line in hbox, even they are hard.
  };

  proto.format = function (boxLeft, startColumn) {
    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      left = frag.format(boxLeft, left);
    }
    return left;
  };

  return klass;
})();

module.exports = Hbox;


},{"./BoxBase":3}],10:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var Hovbox = (function () {
  var baseKlass = BoxBase;
  var klass = Hovbox;

  function Hovbox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.format = function (boxLeft, startColumn) {
    var queue = [];

    function flushQueue(left) {
      for (var i = 0, len = queue.length; i < len; ++i) {
        var frag = queue[i];
        left = frag.format(startColumn, left);
      }
      queue = [];
      return left;
    }

    var limit = this.formatter_.margin() - 1;
    var left = startColumn;
    var right = left;
    var lastHint;

    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      if (frag.kind === "BreakHint") {
        right = left = flushQueue(left);
        lastHint = frag;
      }
      queue.push(frag);
      var hright = frag.leftPosAfterPutHorizontally(right, limit);
      right = hright;

      if (right > limit ||
          (frag.kind === "BreakHint" &&
           frag.hasHardBreakHint())) {
        if (lastHint) {
          lastHint.setToBreak();
          right = left = flushQueue(left);
          lastHint = undefined;
        }
      }
    }
    left = flushQueue(left);
    return left;
  };

  return klass;
})();

module.exports = Hovbox;


},{"./BoxBase":3}],11:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var Hvbox = (function () {
  var baseKlass = BoxBase;
  var klass = Hvbox;

  function Hvbox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.format = function (boxLeft, startColumn) {
    return this.formatImpl_(boxLeft, startColumn, false);
  };

  proto.formatImpl_ = function (boxLeft, startColumn, forceToBreak) {
    var limit = this.formatter_.margin() - 1;
    var toBreak = forceToBreak || (this.leftPosAfterPutHorizontally(startColumn, limit) > limit);
    if (toBreak) {
      this.hints_.forEach(function (h) { h.setToBreak(); });
    }

    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      left = this.buf_[i].format(startColumn, left);

      if (!toBreak && this.formatData_.hasSensitiveLineBreak) {
        this.resetFormatData();
        return this.formatImpl_(boxLeft, startColumn, true);
      }
    }
    return left;
  };

  return klass;
})();

module.exports = Hvbox;


},{"./BoxBase":3}],12:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

var util = require("./util");

var Printer = (function () {
  var klass = Printer;

  function Printer(opt) {
    var hs = opt ? util.shallowCopy(opt) : {};
    hs.output || (hs.output = util.ignore);
    hs.onFinish || (hs.onFinish = util.ignore);
    hs.outputDebug || (hs.outputDebug = util.ignore);
    hs.onString || (hs.onString = util.identity);
    hs.onFlush || (hs.onFlush = util.ignore);
    hs.onSpace || (hs.onSpace = util.spacer);
    hs.onNewline || (hs.onNewline = function () { return "\n"; });
    this.handlers_ = hs;
    this.buf_ = "";
  }

  var proto = klass.prototype;

  var handlerNames = ["onString", "onFlush", "onSpace", "onNewline"];

  proto.setCallbacks = function (callbacks) {
    handlerNames.forEach(function (p) {
      if (callbacks[p])
        this.handlers_[p] = callbacks[p];
    }, this);
  };

  proto.getCallbacks = function () {
    var ret = {};
    handlerNames.forEach(function (p) {
      ret[p] = this.handlers_[p];
    }, this);
    return ret;
  };

  proto.outputDebugString = function (s) {
    var hs = this.handlers_;
    hs.outputDebug(s);
  };

  proto.finish = function () {
    var ret = this.buf_;
    this.buf_ = "";
    this.handlers_.onFinish(ret);
    return ret;
  };

  proto.output_ = function (s) {
    var hs = this.handlers_;
    this.buf_ += s;
    hs.output(s);
  };

  proto.outputString = function (s) {
    var hs = this.handlers_;
    this.output_(hs.onString(s));
  };

  proto.outputFlush = function () {
    this.handlers_.onFlush();
  };

  proto.outputSpace = function (n) {
    var hs = this.handlers_;
    this.output_(hs.onSpace(n));
  };

  proto.outputNewline = function () {
    var hs = this.handlers_;
    this.output_(hs.onNewline());
  };

  return klass;
})();

module.exports = Printer;


},{"./util":16}],13:[function(require,module,exports){
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

proto.dumpString_ = function () {
  return "TEXT: " + this.content;
}

proto.appendedTo = function (box) {
  // nothing to do.
};

proto.resetFormatData = function () {
  // nothing to do.
};

proto.setToBreak = function () {
  // nothing to do.
};

proto.hasHardBreakHint = function () {
  return false;
};

proto.leftPosAfterPutHorizontally = function (left, limit) {
  return left + this.content.length;
};

proto.format = function (boxLeft, startColumn) {
  return startColumn + this.content.length;
};

proto.print = function (boxLeft, startColumn) {
  this.formatter_.printer().outputString(this.content);
  return startColumn + this.content.length;
};

module.exports = klass;


},{"./Fragment":8,"./util":16}],14:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

var BoxBase = require("./BoxBase");

var Vbox = (function () {
  var baseKlass = BoxBase;
  var klass = Vbox;

  function Vbox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.hasHardBreakHint = function () {
    return this.hints_.length() > 0; // Since any break hint cause a line break in Vbox.
  };

  proto.format = function (boxLeft, startColumn) {
    var left = startColumn;
    for (var i = 0, len = this.buf_.length; i < len; ++i) {
      var frag = this.buf_[i];
      if (frag.kind === "BreakHint")
        frag.setToBreak();
      left = frag.format(startColumn, left);
    }
    return left;
  };

  return klass;
})();

module.exports = Vbox;


},{"./BoxBase":3}],15:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

var assert = require("./util").assert;

function numberToString(num, flags, width, prec, type) {
  assert(typeof num === "number", "numberToString: num must be a number");
  assert(width === undefined || width >= 0, "numberToString: width must be positive.");
  assert(prec === undefined || prec >= 0, "numberToString: prec must be positive.");

  flags || (flags = "");

  function toExponential(num, prec, upper) {
    var ret = (prec !== undefined) ? num.toExponential(prec) : num.toExponential();
    return !upper ? ret : ret.replace(/e([^e]+)$/, function (_, s) { return "E" + s });
  }

  function makePadding(ch, len) {
    var rep = ch;
    len = Math.min(Math.max(len, 0), 2048); // ugh! magic number limitation 
    while (rep.length < len)
      rep = rep + rep;
    return rep.slice(0, len);
  }

  var leftJustfy = false;
  var zeroPadding = false;
  var positiveSign = "";

  for (var i = 0; i < flags.length; ++i) {
    switch (flags[i]) {
    case "-": leftJustfy = true; break;
    case "0": zeroPadding = true; break;
    case "+": positiveSign = "+"; break;  // "+" overrides " ".
    case " ": if (positiveSign === "") positiveSign = " "; break;
    case "#": break; // do nothing; unsupported
    default: break; // do nothing; should throw an error?
    }
  }

  var raw;
  switch (type) {
  case "d": // fall through
  case "i": raw = Math.floor(num).toString(); break;
  case "x": raw = num.toString(16); break;
  case "X": raw = num.toString(16).toUpperCase(); break;
  case "o": raw = num.toString(8); break;
  case "F": // fall through
  case "f": raw = (prec !== undefined) ? num.toFixed(prec) : num.toString(); break;
  case "e": raw = toExponential(num, prec, false); break;
  case "E": raw = toExponential(num, prec, true); break;
  case "g": case "G":
    var asF = (prec !== undefined) ? num.toFixed(prec) : num;
    var asE = toExponential(num, prec, type === "G");
    raw = (asF.length >= asE.length) ? asF : asE;
    break;
  case "u": // fall through
  default:
    raw = "(UNSUPPORTED-TYPE %" + type + ")";
    break;
  }

  var ret = raw;
  if (leftJustfy) {
    if (num >= 0)
      ret = positiveSign + ret;
    ret = ret + makePadding(" ", width - ret.length);

  } else {
    if (zeroPadding) {
      var fillLength = width - ret.length - (num >= 0 ? positiveSign.length : 0);
      ret = makePadding("0", fillLength) + ret;
      if (num >= 0)
        ret = positiveSign + ret;

    } else {
      if (num >= 0)
        ret = positiveSign + ret;
      ret = makePadding(" ", width - ret.length) + ret;
    }
  }

  return ret;
}

module.exports = numberToString;

},{"./util":16}],16:[function(require,module,exports){
// vim: set ts=2 sts=2 sw=2 et ai:

var util = module.exports = {
  ignore: function () {},  // do nothing,
  identity: function (x) { return x; },

  maxSpacerLength: 2048,
  spacer: (function () {
    var spacer = "    ";
    return function (n) {
      n = Math.min(Math.max(n, 0), util.maxSpacerLength);
      while (n > spacer.length)
        spacer += spacer;
      return spacer.substr(0, n);
    }
  })(),

  fillAtLeast: function (len, str, toLeftJustify) {
    var l = len - str.length;
    if (l <= 0) return str;
    return toLeftJustify ? str + util.spacer(l) : util.spacer(l) + str;
  },

  shallowCopy: function (o) {
    var ret = {};
    for (var p in o) {
      if (!o.hasOwnProperty(p)) continue;
      ret[p] = o[p];
    }
    return ret;
  },

  indexOf: function (xs, f) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (f(xs[i]))
        return i;
    }
    return -1;
  },

  find: function (xs, f, defaultValue) {
    var ix = util.indexOf(xs, f);
    return ix !== -1 ? xs[ix] : defaultValue;
  },

  nth: function (idx) {
    return idx + ([, "st", "nd", "rd"][idx > 20 ? (idx % 10) : idx] || "th");
  },

  assert: function (pred, msg) {
    if (!pred)
      throw new Error("Assertion Error" + (msg ? (": " + msg) : ""));
  },
  assertObject: function (v, name) {
    util.assert(typeof v === "object", name + " must be an object.");
  },
  assertFunction: function (v, name) {
    util.assert(typeof v === "function", name + " must be a function but " + (typeof v) + ".");
  },
};


},{}]},{},[1])(1)
});