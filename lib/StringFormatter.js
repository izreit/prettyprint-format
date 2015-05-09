// vim: set ts=2 sts=2 sw=2 et ai:

var Formatter = require("./Formatter");

var StringFormatter = (function () {
  var baseKlass = Formatter;
  var klass = StringFormatter;

  function StringFormatter(opt) {
    opt || (opt = {});
    var self = this;
    this.buf_ = "";
    opt.printFun = function (s) { self.buf_ += s; };
    baseKlass.call(this, opt);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.printf = function () {
    baseKlass.prototype.printf.apply(this, arguments);
    return this.buf_;
  };

  return klass;
})();

module.exports = StringFormatter;

