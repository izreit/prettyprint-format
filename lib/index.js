// vim: set ts=2 sts=2 sw=2 et ai:

var Formatter = require("./Formatter");

var fprintf = function (ppf, format, args___) {
  args___ = Array.prototype.slice.call(arguments, 2);

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
        var fun = args___[i++];
        var arg = args___[i++];
        fun(ppf, arg);
        break;
      case "%t":
        var fun = args___[i++];
        fun(ppf);
        break;
      case "%i":
        ppf.printInt(args___[i++]);
        break;
      case "%s":
        ppf.printString(args___[i++]);
        break;
      default:
        console.log("unknown escape: " + matched[1]);
        break;
      }
    }
    ppf.printString(matched[2]);
  }

  ppf.printFlush();
};

var printf = function () {
  var ppf = new Formatter({
    printFun: function (s) { process.stdout.write(s) },
    newlineStr: "$\n",
    limit: 80,
  });
  var args = [ppf];
  Array.prototype.push.apply(args, arguments);
  fprintf.apply(this, args);
};

module.exports = {
  fprintf: fprintf,
  printf: printf,
};

