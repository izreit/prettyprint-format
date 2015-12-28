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
