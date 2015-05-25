// vim: set ts=2 sts=2 sw=2 et ai si:

var expect = require("chai").expect;
var pp = require("../lib/");

describe("general", function () {

  it("margin/maxIndent", function () {
    pp.setMargin(40);
    expect(pp.getMargin()).to.equal(40);

    pp.setMargin(50, 45);
    expect(pp.getMargin()).to.equal(50);
    expect(pp.getMaxIndent()).to.equal(45);

    pp.setMaxIndent(5);
    expect(pp.getMaxIndent()).to.equal(5);
  });

  it("strMargin/strMaxIndent", function () {
    pp.setStrMargin(40);
    expect(pp.getStrMargin()).to.equal(40);

    pp.setStrMargin(20, 15);
    expect(pp.getStrMargin()).to.equal(20);
    expect(pp.getStrMaxIndent()).to.equal(15);

    pp.setStrMaxIndent(5);
    expect(pp.getStrMaxIndent()).to.equal(5);

    var s = pp.sprintf("@[[foooooo@[[bar@ dee@ luuu@ teee@ buuuuuuu@ miiiii]@]@ puu]@]@?");
    var a =
      "[foooooo[bar dee\n" +
      "     luuu teee\n" +
      "     buuuuuuu\n" +
      "     miiiii]\n" +
      "puu]";
    expect(s).to.equal(a);
  });

  it("prints several times", function () {
    var lastFinished;
    var ppf = new pp.Formatter({
      margin: 20,
      onFinish: function (s) { lastFinished = s; },
      onNewline: function () { return "$"; },
      onSpace: function (n) { return "<" + n + ">"; },
      onString: function (s) { return s.toUpperCase(); },
    });

    var s = ppf.printf("@[<v>foo@ zoo@ vee@ %+10.3f@]@.", 45.2);
    var a = "FOO$ZOO$VEE$   +45.200$";
    expect(s).to.equal(a);
    expect(lastFinished).to.equal(a);

    var s = ppf.printf("@[<h>foo@ zoo@ vee@ %+10.3f@]@.", 45.2);
    var a = "FOO<1>ZOO<1>VEE<1>   +45.200$";
    expect(s).to.equal(a);
    expect(lastFinished).to.equal(a);

    var s = ppf.printf("zoo@[% 10e@\n% 10e@\naa@]@?", 0.045, -30.12);
    var a = "ZOO    4.5E-2$<3> -3.012E+1$<3>AA";
    expect(s).to.equal(a);
    expect(lastFinished).to.equal(a);
  });

});
