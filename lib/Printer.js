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

