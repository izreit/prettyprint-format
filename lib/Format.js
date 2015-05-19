// vim: set ts=2 sts=2 sw=2 et ai:

var Formatter = require("./Formatter");
var BoxBase = require("./BoxBase");

function stringify(o, opt) {
  if (typeof opt === "number")
    opt = { margin: opt };

  function arr(ppf, o) {
    for (var i = 0; i < o.length - 1; ++i)
      ppf.printf("@[<hv>%a,@]@ ", str, o[i]);
    ppf.printf("@[<hv>%a@]", str, o[i]);
  }
  function obj(ppf, o) {
    var ks = Object.keys(o);
    for (var i = 0; i < ks.length - 1; ++i)
      ppf.printf("@[<hv>%s: %a,@]@ ", ks[i], str, o[ks[i]]);
    ppf.printf("@[<hv>%s: %a@]", ks[i], str, o[ks[i]]);
  }
  function str(ppf, o) {
    if (typeof o !== "object" || o === null || o === undefined) {
      ppf.printf("%s", JSON.stringify(o));
    } else if (o instanceof Array) {
      if (o.length > 0)
        ppf.printf("[@;<1 2>@[<hov>%a@]@ ]", arr, o);
      else
        ppf.printf("[]");
    } else {
      if (Object.keys(o).length > 0)
        ppf.printf("{@;<1 2>@[<hv>%a@]@ }", obj, o);
      else
        ppf.printf("{}");
    }
  }
  var ppf = new Formatter(opt);
  return ppf.sprintf("@[<hv>%a@]@.", str, o);
}

var DEFAULT_MARGIN = (function () {
  try {
    return global.process.stdout.columns;
  } catch (e) {
    return 78;
  }
})();

function defFormatterFun(n) {
  return function () {
    var ppf = Format.defaultFormatter;
    return ppf[n].apply(ppf, arguments);
  };
}

var Format = {
  Formatter: Formatter,

  defaultFormatter: new Formatter({
    margin: DEFAULT_MARGIN,
    maxIndent: 0,
  }),

  setMargin: defFormatterFun("setMargin"),
  getMargin: defFormatterFun("getMargin"),
  setMaxIndent: defFormatterFun("setMaxIndent"),
  getMaxIndent: defFormatterFun("getMaxIndent"),

  sprintf: defFormatterFun("sprintf"),
  printf: defFormatterFun("printf"),

  stringify: stringify,
};

module.exports = Format;

