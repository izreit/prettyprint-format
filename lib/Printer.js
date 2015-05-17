// vim: set ts=2 sts=2 sw=2 et ai:

var util = require("./util");

var Printer = (function () {
  var klass = Printer;

  function Printer(opt) {
	  util.assertObject(opt, "opt");
	  util.assertFunction(opt.output, "opt.output");
	  util.assertFunction(opt.getResult, "opt.getResult");

    var hs = util.shallowCopy(opt);
    hs.outputDebug || (hs.outputDebug = util.ignore);
    hs.onString || (hs.onString = util.identity);
    hs.onFlush || (hs.onFlush = util.ignore);
    hs.onSpace || (hs.onSpace = util.spacer);
    hs.onNewline || (hs.onNewline = function () { return "\n"; });
    this.handlers_ = hs;
  }

  klass.makeStringPrinter = function (opt) {
    var buf = "";
    var options = {
      output: function (s) { buf += s; },
      getResult: function () { return buf; },
      outputDebug: opt.outputDebug,
      onString: opt.onString,
      onFlush: opt.onFlush,
      onSpace: opt.onSpace,
      onNewline: opt.onNewline,
    };
    return new Printer(options);
  };

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
    this.handlers_.outputDebug(s);
  };

  proto.getResult = function () {
    return this.handlers_.getResult();
  };

  proto.outputString = function (s) {
    var hs = this.handlers_;
    hs.output(hs.onString(s));
  };

  proto.outputFlush = function () {
    this.handlers_.onFlush();
  };

  proto.outputSpace = function (n) {
    var hs = this.handlers_;
    hs.output(hs.onSpace(n));
  };

  proto.outputNewline = function () {
    var hs = this.handlers_;
    hs.output(hs.onNewline());
  };

  return klass;
})();

module.exports = Printer;

