// vim: set ts=2 sts=2 sw=2 et ai:

var Formatter = require("./Formatter");
var StringFormatter = require("./StringFormatter");

var Format = {
  Formatter: Formatter,
  StringFormatter: StringFormatter,

  defaultFormatter: new Formatter({
    newlineStr: "\n",
    margin: (process.stdout && process.stdout.columns) || 78,
  }),

  options: {
    newlineStr: "\n",
    margin: (process.stdout && process.stdout.columns) || 80,
    maxIndent: 0,
  },

  fprintf: function (ppf, format, args___) {
    var args = Array.prototype.slice.call(arguments, 2);
    ppf.printf(format, args);
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
    var result = "";

    var opt = Object.create(Format.options, {
      printFun: {
        value: function (s) { result += s; },
      },
    });
    var ppf = new Formatter(opt);
    ppf.printf(format, args);
    return result;
  },
};

module.exports = Format;

