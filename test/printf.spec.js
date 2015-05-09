// vim: set ts=2 sts=2 sw=2 et ai syn=javascript:

var expect = require("chai").expect;
var pp = require("../lib/");

describe("printf", function () {

  it("5/@[<hv>aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.", function () {
    var ppf = new pp.StringFormatter();
    ppf.setMargin(5);
    var formatted = ppf.printf("@[<hv>aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.");
    var expected = "aa\nbb\nc\ndddd\neeee\nf\ngg\nh\ni\nj";
    expect(formatted).equal(expected);
  });

  it("10/@[<hv>aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.", function () {
    var ppf = new pp.StringFormatter();
    ppf.setMargin(10);
    var formatted = ppf.printf("@[<hv>aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.");
    var expected = "aa\nbb\nc\ndddd\neeee\nf\ngg\nh\ni\nj";
    expect(formatted).equal(expected);
  });

});

