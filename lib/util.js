// vim: set ts=2 sts=2 sw=2 et ai:

var util = module.exports = {
  maxSpacerLength: 2048,

  spacer: (function () {
    var spacer = "    ";
    return function (n, src) {
      n = Math.min(Math.max(n, 0), util.maxSpacerLength);
      while (n > spacer.length)
        spacer += spacer;
      return spacer.substr(0, n);
    }
  })(),

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
};

