// vim: set ts=2 sts=2 sw=2 et ai:

var Box = require("./Box");

var HVBox = (function () {
  var baseKlass = Box;
  var klass = HVBox;

  function HVBox(formatter, additionalIndent, sensitive) {
    baseKlass.call(this, formatter, additionalIndent, sensitive);
  }

  var proto = klass.prototype = Object.create(baseKlass.prototype, {
    constructor: { value: klass },
  });

  proto.shrink = function (boxLeft, startColumn) {
    this.hints_.forEach(function (h) { h.setToBreak(true); });
  };

  return klass;
})();

module.exports = HVBox;

