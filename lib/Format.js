// vim: set ts=2 sts=2 sw=2 et ai:

var Formatter = require("./Formatter");

function print(ppf, format, args) {
  var s = format.match(/^([^@%]*)/)[0];
  if (s.length > 0)
    ppf.printString(s);

  var i = 0;
  var matched;
  var re = /([@%].)([^@%]*)/g;
  re.lastIndex = s.length;

  while (matched = re.exec(format)) {
    if (matched[1]) {
      switch (matched[1]) {
      case "@[":
        ppf.openBox();
        break;
      case "@]":
        ppf.closeBox();
        break;
      case "@ ":
        ppf.printSpace();
        break;
      case "%a":
        var fun = args[i++];
        var arg = args[i++];
        fun(ppf, arg);
        break;
      case "%t":
        var fun = args[i++];
        fun(ppf);
        break;
      case "%i":
        ppf.printInt(args[i++]);
        break;
      case "%s":
        ppf.printString(args[i++]);
        break;
      default:
        console.log("unknown escape: " + matched[1]);
        break;
      }
    }
    ppf.printString(matched[2]);
  }

  ppf.printFlush();
}

var Format = {
  options: {
    newlineStr: "\n",
    limit: (process.stdout && process.stdout.columns) || 80,
    margin: 0,
    maxIndent: 0,
  },

  fprintf: function (ppf, format, args___) {
    var args = Array.prototype.slice.call(arguments, 2);
    print(ppf, format, args);
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
    print(ppf, format, args);
    return result;
  },
};

module.exports = Format;

