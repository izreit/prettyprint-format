// vim: set ts=2 sts=2 sw=2 et ai:

var Formatter = require("./Formatter");
var BoxBase = require("./BoxBase");

function stringify(o, margin) {
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
      var ks = Object.keys(o);
      if (ks.length > 0)
        ppf.printf("{@;<1 2>@[<hv>%a@]@ }", obj, o);
      else
        ppf.printf("{}");
    }
  }
  var ppf = new Formatter({
    onNewline: function () { return "$\n"; },
    outputDebug: function (s) { this.output(s); },
    margin: margin || (process.stdout && process.stdout.columns) || 78,
  });
  return ppf.sprintf("@[<hv>%a@]@.", str, o);
}

var Format = {
  Formatter: Formatter,
  stringify: stringify,

  setDebugMode: function (v) {
    BoxBase.debugMode = v;
  },

  options: {
    margin: (process.stdout && process.stdout.columns) || 78,
    maxIndent: 0,
  },

  fprintf: function (ppf, format, args___) {
    var args = Array.prototype.slice.call(arguments, 2);
    ppf.printf(format, args);
    return ppf.printer().getResult();
  },

  printf: function () {
    // It is not possible to implement `printf` precisely on Web browsers
    // because `console.log` cannot output a string without a trailing newline.
    // Note `process.stdout.write` can be used if your code runs only on Node.js.
    var s = Format.sprintf.apply(Format, arguments);
    console.log(s);
  },

  sprintf: function (format, args___) {
    var args = Array.prototype.slice.call(arguments, 1);
    var ppf = new Formatter(Format.options);
    ppf.printf(format, args);
    return ppf.printer().getResult();
  },
};

module.exports = Format;

