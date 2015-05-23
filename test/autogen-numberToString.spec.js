// vim: set ts=2 sts=2 sw=2 et ai syn=javascript:

var expect = require("chai").expect;
var numberToString = require("../lib/numberToString");

describe("numberToString", function () {

  it("[\"2a\",42,null,null,null,\"x\"]", function () {
    var actual = numberToString(42, undefined, undefined, undefined, "x");
    expect(actual).equal("2a");
  });

  it("[\" 2a\",42,\" \",null,null,\"x\"]", function () {
    var actual = numberToString(42, " ", undefined, undefined, "x");
    expect(actual).equal(" 2a");
  });

  it("[\"+2a\",42,\"+\",null,null,\"x\"]", function () {
    var actual = numberToString(42, "+", undefined, undefined, "x");
    expect(actual).equal("+2a");
  });

  it("[\"+2a\",42,\" +\",null,null,\"x\"]", function () {
    var actual = numberToString(42, " +", undefined, undefined, "x");
    expect(actual).equal("+2a");
  });

  it("[\"+2a\",42,\"- +\",null,null,\"x\"]", function () {
    var actual = numberToString(42, "- +", undefined, undefined, "x");
    expect(actual).equal("+2a");
  });

  it("[\"   +2a\",42,\" +\",6,null,\"x\"]", function () {
    var actual = numberToString(42, " +", 6, undefined, "x");
    expect(actual).equal("   +2a");
  });

  it("[\"+2a   \",42,\"- +\",6,null,\"x\"]", function () {
    var actual = numberToString(42, "- +", 6, undefined, "x");
    expect(actual).equal("+2a   ");
  });

  it("[\" 2a   \",42,\"- \",6,null,\"x\"]", function () {
    var actual = numberToString(42, "- ", 6, undefined, "x");
    expect(actual).equal(" 2a   ");
  });

  it("[\" 2a\",42,\"0 \",null,null,\"x\"]", function () {
    var actual = numberToString(42, "0 ", undefined, undefined, "x");
    expect(actual).equal(" 2a");
  });

  it("[\"+2a\",42,\"0+\",null,null,\"x\"]", function () {
    var actual = numberToString(42, "0+", undefined, undefined, "x");
    expect(actual).equal("+2a");
  });

  it("[\"+2a\",42,\"0 +\",null,null,\"x\"]", function () {
    var actual = numberToString(42, "0 +", undefined, undefined, "x");
    expect(actual).equal("+2a");
  });

  it("[\"+2a\",42,\"0- +\",null,null,\"x\"]", function () {
    var actual = numberToString(42, "0- +", undefined, undefined, "x");
    expect(actual).equal("+2a");
  });

  it("[\"+0002a\",42,\"0 +\",6,null,\"x\"]", function () {
    var actual = numberToString(42, "0 +", 6, undefined, "x");
    expect(actual).equal("+0002a");
  });

  it("[\"+2a   \",42,\"0- +\",6,null,\"x\"]", function () {
    var actual = numberToString(42, "0- +", 6, undefined, "x");
    expect(actual).equal("+2a   ");
  });

  it("[\" 2a   \",42,\"0- \",6,null,\"x\"]", function () {
    var actual = numberToString(42, "0- ", 6, undefined, "x");
    expect(actual).equal(" 2a   ");
  });

  it("[\"42\",42,null,null,null,\"d\"]", function () {
    var actual = numberToString(42, undefined, undefined, undefined, "d");
    expect(actual).equal("42");
  });

});


