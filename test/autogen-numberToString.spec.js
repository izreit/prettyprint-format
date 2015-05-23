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

  it("[\"42\",42.63,null,1,null,\"d\"]", function () {
    var actual = numberToString(42.63, undefined, 1, undefined, "d");
    expect(actual).equal("42");
  });

  it("[\"     42\",42.63,null,7,null,\"d\"]", function () {
    var actual = numberToString(42.63, undefined, 7, undefined, "d");
    expect(actual).equal("     42");
  });

  it("[\"      42\",42.63,null,8,null,\"d\"]", function () {
    var actual = numberToString(42.63, undefined, 8, undefined, "d");
    expect(actual).equal("      42");
  });

  it("[\"      42\",42.63,null,8,0,\"d\"]", function () {
    var actual = numberToString(42.63, undefined, 8, 0, "d");
    expect(actual).equal("      42");
  });

  it("[\"      42\",42.63,null,8,2,\"d\"]", function () {
    var actual = numberToString(42.63, undefined, 8, 2, "d");
    expect(actual).equal("      42");
  });

  it("[\"42.63\",42.63,null,null,null,\"f\"]", function () {
    var actual = numberToString(42.63, undefined, undefined, undefined, "f");
    expect(actual).equal("42.63");
  });

  it("[\"42.63\",42.63,null,4,null,\"f\"]", function () {
    var actual = numberToString(42.63, undefined, 4, undefined, "f");
    expect(actual).equal("42.63");
  });

  it("[\"42.63\",42.63,null,5,null,\"f\"]", function () {
    var actual = numberToString(42.63, undefined, 5, undefined, "f");
    expect(actual).equal("42.63");
  });

  it("[\" 42.63\",42.63,null,6,null,\"f\"]", function () {
    var actual = numberToString(42.63, undefined, 6, undefined, "f");
    expect(actual).equal(" 42.63");
  });

  it("[\"  42.63\",42.63,null,7,null,\"f\"]", function () {
    var actual = numberToString(42.63, undefined, 7, undefined, "f");
    expect(actual).equal("  42.63");
  });

  it("[\"   42.63\",42.63,null,8,null,\"f\"]", function () {
    var actual = numberToString(42.63, undefined, 8, undefined, "f");
    expect(actual).equal("   42.63");
  });

  it("[\"      43\",42.63,null,8,0,\"f\"]", function () {
    var actual = numberToString(42.63, undefined, 8, 0, "f");
    expect(actual).equal("      43");
  });

  it("[\"    42.6\",42.63,null,8,1,\"f\"]", function () {
    var actual = numberToString(42.63, undefined, 8, 1, "f");
    expect(actual).equal("    42.6");
  });

  it("[\"   42.63\",42.63,null,8,2,\"f\"]", function () {
    var actual = numberToString(42.63, undefined, 8, 2, "f");
    expect(actual).equal("   42.63");
  });

  it("[\"42\",42,null,null,null,\"d\"]", function () {
    var actual = numberToString(42, undefined, undefined, undefined, "d");
    expect(actual).equal("42");
  });

});


