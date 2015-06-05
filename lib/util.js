// vim: set ts=2 sts=2 sw=2 et ai:

var util = module.exports = {
  ignore: function () {},  // do nothing,
  identity: function (x) { return x; },

  maxSpacerLength: 2048,
  spacer: (function () {
    var spacer = "    ";
    return function (n) {
      n = Math.min(Math.max(n, 0), util.maxSpacerLength);
      while (n > spacer.length)
        spacer += spacer;
      return spacer.substr(0, n);
    }
  })(),

  fillAtLeast: function (len, str, toLeftJustify) {
    var l = len - str.length;
    if (l <= 0) return str;
    return toLeftJustify ? str + util.spacer(l) : util.spacer(l) + str;
  },

  shallowCopy: function (o) {
    var ret = {};
    for (var p in o) {
      if (!o.hasOwnProperty(p)) continue;
      ret[p] = o[p];
    }
    return ret;
  },

  indexOf: function (xs, f) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (f(xs[i]))
        return i;
    }
    return -1;
  },

  find: function (xs, f, defaultValue) {
    var ix = util.indexOf(xs, f);
    return ix !== -1 ? xs[ix] : defaultValue;
  },

  nth: function (idx) {
    return idx + ([, "st", "nd", "rd"][idx > 20 ? (idx % 10) : idx] || "th");
  },

  assert: function (pred, msg) {
    if (!pred)
      throw new Error("Assertion Error" + (msg ? (": " + msg) : ""));
  },
  assertObject: function (v, name) {
    util.assert(typeof v === "object", name + " must be an object.");
  },
  assertFunction: function (v, name) {
    util.assert(typeof v === "function", name + " must be a function but " + (typeof v) + ".");
  },
};

