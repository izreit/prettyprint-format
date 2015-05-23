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

  it("[\"+0002A\",42,\"0 +\",6,null,\"X\"]", function () {
    var actual = numberToString(42, "0 +", 6, undefined, "X");
    expect(actual).equal("+0002A");
  });

  it("[\"+2A   \",42,\"0- +\",6,null,\"X\"]", function () {
    var actual = numberToString(42, "0- +", 6, undefined, "X");
    expect(actual).equal("+2A   ");
  });

  it("[\" 2A   \",42,\"0- \",6,null,\"X\"]", function () {
    var actual = numberToString(42, "0- ", 6, undefined, "X");
    expect(actual).equal(" 2A   ");
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

  it("[\"-43\",-42.63,null,1,null,\"d\"]", function () {
    var actual = numberToString(-42.63, undefined, 1, undefined, "d");
    expect(actual).equal("-43");
  });

  it("[\"    -43\",-42.63,null,7,null,\"d\"]", function () {
    var actual = numberToString(-42.63, undefined, 7, undefined, "d");
    expect(actual).equal("    -43");
  });

  it("[\"     -43\",-42.63,null,8,null,\"d\"]", function () {
    var actual = numberToString(-42.63, undefined, 8, undefined, "d");
    expect(actual).equal("     -43");
  });

  it("[\"     -43\",-42.63,null,8,0,\"d\"]", function () {
    var actual = numberToString(-42.63, undefined, 8, 0, "d");
    expect(actual).equal("     -43");
  });

  it("[\"     -43\",-42.63,null,8,2,\"d\"]", function () {
    var actual = numberToString(-42.63, undefined, 8, 2, "d");
    expect(actual).equal("     -43");
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

  it("[\"+42.63  \",42.63,\"-+\",8,null,\"f\"]", function () {
    var actual = numberToString(42.63, "-+", 8, undefined, "f");
    expect(actual).equal("+42.63  ");
  });

  it("[\"+43     \",42.63,\"-+\",8,0,\"f\"]", function () {
    var actual = numberToString(42.63, "-+", 8, 0, "f");
    expect(actual).equal("+43     ");
  });

  it("[\"+42.6   \",42.63,\"-+\",8,1,\"f\"]", function () {
    var actual = numberToString(42.63, "-+", 8, 1, "f");
    expect(actual).equal("+42.6   ");
  });

  it("[\"+42.63  \",42.63,\"-+\",8,2,\"f\"]", function () {
    var actual = numberToString(42.63, "-+", 8, 2, "f");
    expect(actual).equal("+42.63  ");
  });

  it("[\"+0042.63\",42.63,\"0+\",8,null,\"f\"]", function () {
    var actual = numberToString(42.63, "0+", 8, undefined, "f");
    expect(actual).equal("+0042.63");
  });

  it("[\"+0000043\",42.63,\"0+\",8,0,\"f\"]", function () {
    var actual = numberToString(42.63, "0+", 8, 0, "f");
    expect(actual).equal("+0000043");
  });

  it("[\"+00042.6\",42.63,\"0+\",8,1,\"f\"]", function () {
    var actual = numberToString(42.63, "0+", 8, 1, "f");
    expect(actual).equal("+00042.6");
  });

  it("[\"+0042.63\",42.63,\"0+\",8,2,\"f\"]", function () {
    var actual = numberToString(42.63, "0+", 8, 2, "f");
    expect(actual).equal("+0042.63");
  });

  it("[\" 0042.63\",42.63,\"0 \",8,null,\"f\"]", function () {
    var actual = numberToString(42.63, "0 ", 8, undefined, "f");
    expect(actual).equal(" 0042.63");
  });

  it("[\" 0000043\",42.63,\"0 \",8,0,\"f\"]", function () {
    var actual = numberToString(42.63, "0 ", 8, 0, "f");
    expect(actual).equal(" 0000043");
  });

  it("[\" 00042.6\",42.63,\"0 \",8,1,\"f\"]", function () {
    var actual = numberToString(42.63, "0 ", 8, 1, "f");
    expect(actual).equal(" 00042.6");
  });

  it("[\" 0042.63\",42.63,\"0 \",8,2,\"f\"]", function () {
    var actual = numberToString(42.63, "0 ", 8, 2, "f");
    expect(actual).equal(" 0042.63");
  });

  it("[\"   1.5110083e+3\",1511.0083,null,15,null,\"e\"]", function () {
    var actual = numberToString(1511.0083, undefined, 15, undefined, "e");
    expect(actual).equal("   1.5110083e+3");
  });

  it("[\"      1.5110e+3\",1511.0083,null,15,4,\"e\"]", function () {
    var actual = numberToString(1511.0083, undefined, 15, 4, "e");
    expect(actual).equal("      1.5110e+3");
  });

  it("[\"0001.5110083e+3\",1511.0083,\"0\",15,null,\"e\"]", function () {
    var actual = numberToString(1511.0083, "0", 15, undefined, "e");
    expect(actual).equal("0001.5110083e+3");
  });

  it("[\"0000001.5110e+3\",1511.0083,\"0\",15,4,\"e\"]", function () {
    var actual = numberToString(1511.0083, "0", 15, 4, "e");
    expect(actual).equal("0000001.5110e+3");
  });

  it("[\"1.5110083e+3   \",1511.0083,\"-\",15,null,\"e\"]", function () {
    var actual = numberToString(1511.0083, "-", 15, undefined, "e");
    expect(actual).equal("1.5110083e+3   ");
  });

  it("[\"1.5110e+3      \",1511.0083,\"-\",15,4,\"e\"]", function () {
    var actual = numberToString(1511.0083, "-", 15, 4, "e");
    expect(actual).equal("1.5110e+3      ");
  });

  it("[\" 001.5110083e+3\",1511.0083,\"0 \",15,null,\"e\"]", function () {
    var actual = numberToString(1511.0083, "0 ", 15, undefined, "e");
    expect(actual).equal(" 001.5110083e+3");
  });

  it("[\" 000001.5110e+3\",1511.0083,\"0 \",15,4,\"e\"]", function () {
    var actual = numberToString(1511.0083, "0 ", 15, 4, "e");
    expect(actual).equal(" 000001.5110e+3");
  });

  it("[\"    1.511083E-3\",0.001511083,null,15,null,\"E\"]", function () {
    var actual = numberToString(0.001511083, undefined, 15, undefined, "E");
    expect(actual).equal("    1.511083E-3");
  });

  it("[\"      1.5111E-3\",0.001511083,null,15,4,\"E\"]", function () {
    var actual = numberToString(0.001511083, undefined, 15, 4, "E");
    expect(actual).equal("      1.5111E-3");
  });

  it("[\"42\",42,null,null,null,\"d\"]", function () {
    var actual = numberToString(42, undefined, undefined, undefined, "d");
    expect(actual).equal("42");
  });

});


