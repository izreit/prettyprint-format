// vim: set ts=2 sts=2 sw=2 et ai:

var assert = require("./util").assert;

function numberToString(num, flags, width, prec, type) {
  assert(typeof num === "number", "numberToString: num must be a number");
  assert(width === undefined || width >= 0, "numberToString: width must be positive.");
  assert(prec === undefined || prec >= 0, "numberToString: prec must be positive.");

  flags || (flags = "");

  function toExponential(num, prec, upper) {
    var ret = (prec !== undefined) ? num.toExponential(prec) : num.toExponential();
    return !upper ? ret : ret.replace(/e([^e]+)$/, function (_, s) { return "E" + s });
  }

  function makePadding(ch, len) {
    var rep = ch;
    len = Math.min(Math.max(len, 0), 2048); // ugh! magic number limitation 
    while (rep.length < len)
      rep = rep + rep;
    return rep.slice(0, len);
  }

  var leftJustfy = false;
  var zeroPadding = false;
  var positiveSign = "";

  for (var i = 0; i < flags.length; ++i) {
    switch (flags[i]) {
    case "-": leftJustfy = true; break;
    case "0": zeroPadding = true; break;
    case "+": positiveSign = "+"; break;  // "+" overrides " ".
    case " ": if (positiveSign === "") positiveSign = " "; break;
    case "#": break; // do nothing; unsupported
    default: break; // do nothing; should throw an error?
    }
  }

  var raw;
  switch (type) {
  case "d": // fall through
  case "i": raw = Math.floor(num).toString(); break;
  case "x": raw = num.toString(16); break;
  case "X": raw = num.toString(16).toUpperCase(); break;
  case "o": raw = num.toString(8); break;
  case "F": // fall through
  case "f": raw = (prec !== undefined) ? num.toFixed(prec) : num.toString(); break;
  case "e": raw = toExponential(num, prec, false); break;
  case "E": raw = toExponential(num, prec, true); break;
  case "g": case "G":
    var asF = (prec !== undefined) ? num.toFixed(prec) : num;
    var asE = toExponential(num, prec, type === "G");
    raw = (asF.length >= asE.length) ? asF : asE;
    break;
  case "u": // fall through
  default:
    raw = "(UNSUPPORTED-TYPE %" + type + ")";
    break;
  }

  var ret = raw;
  if (leftJustfy) {
    if (num >= 0)
      ret = positiveSign + ret;
    ret = ret + makePadding(" ", width - ret.length);

  } else {
    if (zeroPadding) {
      var fillLength = width - ret.length - (num >= 0 ? positiveSign.length : 0);
      ret = makePadding("0", fillLength) + ret;
      if (num >= 0)
        ret = positiveSign + ret;

    } else {
      if (num >= 0)
        ret = positiveSign + ret;
      ret = makePadding(" ", width - ret.length) + ret;
    }
  }

  return ret;
}

module.exports = numberToString;
