// vim: set ts=2 sts=2 sw=2 et ai syn=javascript:

var expect = require("chai").expect;
var pp = require("../lib/");

describe("printf", function () {

  it("5/@[<h>aaaaa@ @[<v>[b@ c]@]@]@.", function () {
    
    /* 
      12345
      aaaaa [b
          c]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(5, 4);
    var formatted = ppf.printf("@[<h>aaaaa@ @[<v>[b@ c]@]@]@.");
    var expected = "aaaaa [b\n    c]";
    expect(formatted).equal(expected);
  });

  it("7/@[<h>aaaaa@ @[<v>[b@ c]@]@]@.", function () {
    
    /* 
      1234567
      aaaaa [b
            c]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(7, 6);
    var formatted = ppf.printf("@[<h>aaaaa@ @[<v>[b@ c]@]@]@.");
    var expected = "aaaaa [b\n      c]";
    expect(formatted).equal(expected);
  });

  it("9/@[<h>aaaaa@ @[<v>[b@ c]@]@]@.", function () {
    
    /* 
      123456789
      aaaaa [b
            c]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(9, 8);
    var formatted = ppf.printf("@[<h>aaaaa@ @[<v>[b@ c]@]@]@.");
    var expected = "aaaaa [b\n      c]";
    expect(formatted).equal(expected);
  });

  it("11/@[<h>aaaaa@ @[<v>[b@ c]@]@]@.", function () {
    
    /* 
      12345678901
      aaaaa [b
            c]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(11, 10);
    var formatted = ppf.printf("@[<h>aaaaa@ @[<v>[b@ c]@]@]@.");
    var expected = "aaaaa [b\n      c]";
    expect(formatted).equal(expected);
  });

  it("13/@[<h>aaaaa@ @[<v>[b@ c]@]@]@.", function () {
    
    /* 
      1234567890123
      aaaaa [b
            c]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(13, 12);
    var formatted = ppf.printf("@[<h>aaaaa@ @[<v>[b@ c]@]@]@.");
    var expected = "aaaaa [b\n      c]";
    expect(formatted).equal(expected);
  });

  it("15/@[<h>aaaaa@ @[<v>[b@ c]@]@]@.", function () {
    
    /* 
      123456789012345
      aaaaa [b
            c]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(15, 14);
    var formatted = ppf.printf("@[<h>aaaaa@ @[<v>[b@ c]@]@]@.");
    var expected = "aaaaa [b\n      c]";
    expect(formatted).equal(expected);
  });

  it("17/@[<h>aaaaa@ @[<v>[b@ c]@]@]@.", function () {
    
    /* 
      12345678901234567
      aaaaa [b
            c]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(17, 16);
    var formatted = ppf.printf("@[<h>aaaaa@ @[<v>[b@ c]@]@]@.");
    var expected = "aaaaa [b\n      c]";
    expect(formatted).equal(expected);
  });

  it("3/@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.", function () {
    // aditional indent
    /* 
      123
      [ddd
        eeee
      f
      ggggggggg]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(3, 2);
    var formatted = ppf.printf("@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.");
    var expected = "[ddd\n  eeee\nf\nggggggggg]";
    expect(formatted).equal(expected);
  });

  it("4/@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.", function () {
    // aditional indent
    /* 
      1234
      [ddd
         eeee
      f
      ggggggggg]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(4, 3);
    var formatted = ppf.printf("@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.");
    var expected = "[ddd\n   eeee\nf\nggggggggg]";
    expect(formatted).equal(expected);
  });

  it("5/@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.", function () {
    // aditional indent
    /* 
      12345
      [ddd
          eeee
      f
      ggggggggg]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(5, 4);
    var formatted = ppf.printf("@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.");
    var expected = "[ddd\n    eeee\nf\nggggggggg]";
    expect(formatted).equal(expected);
  });

  it("6/@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.", function () {
    // aditional indent
    /* 
      123456
      [ddd
          eeee
      f
      ggggggggg]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(6, 5);
    var formatted = ppf.printf("@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.");
    var expected = "[ddd\n    eeee\nf\nggggggggg]";
    expect(formatted).equal(expected);
  });

  it("7/@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.", function () {
    // aditional indent
    /* 
      1234567
      [ddd
          eeee
      f
      ggggggggg]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(7, 6);
    var formatted = ppf.printf("@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.");
    var expected = "[ddd\n    eeee\nf\nggggggggg]";
    expect(formatted).equal(expected);
  });

  it("8/@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.", function () {
    // aditional indent
    /* 
      12345678
      [ddd
          eeee
      f
      ggggggggg]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(8, 7);
    var formatted = ppf.printf("@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.");
    var expected = "[ddd\n    eeee\nf\nggggggggg]";
    expect(formatted).equal(expected);
  });

  it("9/@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.", function () {
    // aditional indent
    /* 
      123456789
      [ddd
          eeee
      f
      ggggggggg]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(9, 8);
    var formatted = ppf.printf("@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.");
    var expected = "[ddd\n    eeee\nf\nggggggggg]";
    expect(formatted).equal(expected);
  });

  it("10/@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.", function () {
    // aditional indent
    /* 
      1234567890
      [ddd
          eeee
      f
      ggggggggg]
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(10, 9);
    var formatted = ppf.printf("@[[ddd@;<2 4>eeee@ f@ ggggggggg]@]@.");
    var expected = "[ddd\n    eeee\nf\nggggggggg]";
    expect(formatted).equal(expected);
  });

  it("5/@[aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.", function () {
    
    /* 
      12345
      aa
      bb c
      dddd
      eeee
      f gg
      h i
      j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(5, 4);
    var formatted = ppf.printf("@[aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.");
    var expected = "aa\nbb c\ndddd\neeee\nf gg\nh i\nj";
    expect(formatted).equal(expected);
  });

  it("5/@[<hv 1>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    
    /* 
      12345
      aa
       bb
       c
       [ddd
       eeee
       f
       g]
       h
       i
       j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(5, 4);
    var formatted = ppf.printf("@[<hv 1>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa\n bb\n c\n [ddd\n eeee\n f\n g]\n h\n i\n j";
    expect(formatted).equal(expected);
  });

  it("10/@[<hv 1>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    
    /* 
      1234567890
      aa
       bb
       c
       [ddd
       eeee f
       g]
       h
       i
       j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(10, 9);
    var formatted = ppf.printf("@[<hv 1>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa\n bb\n c\n [ddd\n eeee f\n g]\n h\n i\n j";
    expect(formatted).equal(expected);
  });

  it("15/@[<hv 1>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    
    /* 
      123456789012345
      aa
       bb
       c
       [ddd eeee f
       g]
       h
       i
       j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(15, 14);
    var formatted = ppf.printf("@[<hv 1>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa\n bb\n c\n [ddd eeee f\n g]\n h\n i\n j";
    expect(formatted).equal(expected);
  });

  it("10/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    // hbox to box
    /* 
      1234567890
      aa bb c [ddd
              eeee
              f
              g] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(10, 9);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        f\n        g] h i j";
    expect(formatted).equal(expected);
  });

  it("12/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    // hbox to box
    /* 
      123456789012
      aa bb c [ddd
              eeee
              f
              g] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(12, 11);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        f\n        g] h i j";
    expect(formatted).equal(expected);
  });

  it("14/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    // hbox to box
    /* 
      12345678901234
      aa bb c [ddd
              eeee
              f g] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(14, 13);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        f g] h i j";
    expect(formatted).equal(expected);
  });

  it("17/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    // hbox to box
    /* 
      12345678901234567
      aa bb c [ddd
              eeee f
              g] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(17, 16);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee f\n        g] h i j";
    expect(formatted).equal(expected);
  });

  it("19/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    // hbox to box
    /* 
      1234567890123456789
      aa bb c [ddd eeee
              f g] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(19, 18);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd eeee\n        f g] h i j";
    expect(formatted).equal(expected);
  });

  it("23/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    // hbox to box
    /* 
      12345678901234567890123
      aa bb c [ddd eeee f g] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(23, 22);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd eeee f g] h i j";
    expect(formatted).equal(expected);
  });

  it("9/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2
    /* 
      123456789
      aa bb c [ddd
              eeee
              f
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(9, 8);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        f\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("11/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2
    /* 
      12345678901
      aa bb c [ddd
              eeee
              f
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(11, 10);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        f\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("12/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2
    /* 
      123456789012
      aa bb c [ddd
              eeee
              f
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(12, 11);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        f\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("13/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2
    /* 
      1234567890123
      aa bb c [ddd
              eeee
              f
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(13, 12);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        f\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("14/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2
    /* 
      12345678901234
      aa bb c [ddd
              eeee
              f
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(14, 13);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        f\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("15/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2
    /* 
      123456789012345
      aa bb c [ddd
              eeee f
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(15, 14);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee f\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("12/@[<h>aa@ bb@ c@ @[<1>[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-A
    /* 
      123456789012
      aa bb c [ddd
               eeee
               f
               ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(12, 11);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[<1>[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n         eeee\n         f\n         ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("14/@[<h>aa@ bb@ c@ @[<1>[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-A
    /* 
      12345678901234
      aa bb c [ddd
               eeee
               f
               ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(14, 13);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[<1>[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n         eeee\n         f\n         ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("15/@[<h>aa@ bb@ c@ @[<1>[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-A
    /* 
      123456789012345
      aa bb c [ddd
               eeee
               f
               ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(15, 14);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[<1>[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n         eeee\n         f\n         ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("22/@[<h>aa@ bb@ c@ @[<1>[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-A
    /* 
      1234567890123456789012
      aa bb c [ddd eeee f
               ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(22, 21);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[<1>[ddd@ eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd eeee f\n         ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("15/@[<h>aa@ bb@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B
    /* 
      123456789012345
      aa bb c [ddd
                 eeee
              f
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(15, 14);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n           eeee\n        f\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("18/@[<h>aa@ bb@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B
    /* 
      123456789012345678
      aa bb c [ddd
                 eeee
              f
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(18, 17);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n           eeee\n        f\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("19/@[<h>aa@ bb@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B
    /* 
      1234567890123456789
      aa bb c [ddd
                 eeee
              f
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(19, 18);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n           eeee\n        f\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("20/@[<h>aa@ bb@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B
    /* 
      12345678901234567890
      aa bb c [ddd
                 eeee
              f
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(20, 19);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n           eeee\n        f\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("21/@[<h>aa@ bb@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B
    /* 
      123456789012345678901
      aa bb c [ddd
                 eeee
              f ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(21, 20);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n           eeee\n        f ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("15/@[<h>a@ b@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B-A
    /* 
      123456789012345
      a b c [ddd
               eeee
            f
            ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(15, 14);
    var formatted = ppf.printf("@[<h>a@ b@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "a b c [ddd\n         eeee\n      f\n      ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("18/@[<h>a@ b@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B-A
    /* 
      123456789012345678
      a b c [ddd
               eeee
            f
            ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(18, 17);
    var formatted = ppf.printf("@[<h>a@ b@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "a b c [ddd\n         eeee\n      f\n      ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("19/@[<h>a@ b@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B-A
    /* 
      1234567890123456789
      a b c [ddd
               eeee
            f ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(19, 18);
    var formatted = ppf.printf("@[<h>a@ b@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "a b c [ddd\n         eeee\n      f ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("20/@[<h>a@ b@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B-A
    /* 
      12345678901234567890
      a b c [ddd
               eeee
            f ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(20, 19);
    var formatted = ppf.printf("@[<h>a@ b@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "a b c [ddd\n         eeee\n      f ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("21/@[<h>a@ b@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B-A
    /* 
      123456789012345678901
      a b c [ddd      eeee
            f ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(21, 20);
    var formatted = ppf.printf("@[<h>a@ b@ c@ @[[ddd@;<6 3>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "a b c [ddd      eeee\n      f ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("15/@[<h>abc@ @[[ddd@;<6 4>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B-B
    /* 
      123456789012345
      abc [ddd
              eeee
          f
          ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(15, 14);
    var formatted = ppf.printf("@[<h>abc@ @[[ddd@;<6 4>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "abc [ddd\n        eeee\n    f\n    ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("18/@[<h>abc@ @[[ddd@;<6 4>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B-B
    /* 
      123456789012345678
      abc [ddd
              eeee
          f ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(18, 17);
    var formatted = ppf.printf("@[<h>abc@ @[[ddd@;<6 4>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "abc [ddd\n        eeee\n    f ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("19/@[<h>abc@ @[[ddd@;<6 4>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B-B
    /* 
      1234567890123456789
      abc [ddd      eeee
          f ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(19, 18);
    var formatted = ppf.printf("@[<h>abc@ @[[ddd@;<6 4>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "abc [ddd      eeee\n    f ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("20/@[<h>abc@ @[[ddd@;<6 4>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B-B
    /* 
      12345678901234567890
      abc [ddd      eeee
          f ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(20, 19);
    var formatted = ppf.printf("@[<h>abc@ @[[ddd@;<6 4>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "abc [ddd      eeee\n    f ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("21/@[<h>abc@ @[[ddd@;<6 4>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 2-B-B
    /* 
      123456789012345678901
      abc [ddd      eeee f
          ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(21, 20);
    var formatted = ppf.printf("@[<h>abc@ @[[ddd@;<6 4>eeee@ f@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "abc [ddd      eeee f\n    ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("9/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 3 (the second (or later) line-break in the box has never enough room)
    /* 
      123456789
      aa bb c [ddd
              eeee
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(9, 8);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("11/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 3 (the second (or later) line-break in the box has never enough room)
    /* 
      12345678901
      aa bb c [ddd
              eeee
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(11, 10);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("12/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 3 (the second (or later) line-break in the box has never enough room)
    /* 
      123456789012
      aa bb c [ddd
              eeee
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(12, 11);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("13/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 3 (the second (or later) line-break in the box has never enough room)
    /* 
      1234567890123
      aa bb c [ddd
              eeee
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(13, 12);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("14/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 3 (the second (or later) line-break in the box has never enough room)
    /* 
      12345678901234
      aa bb c [ddd
              eeee
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(14, 13);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("15/@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 3 (the second (or later) line-break in the box has never enough room)
    /* 
      123456789012345
      aa bb c [ddd
              eeee
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(15, 14);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeee\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("6/@[<h>aa@ bb@ c@ @[[ddd@ eeeeeeeeeeeeeeeeeeeeeeeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 4 (the first line-break in the box has never enough room)
    /* 
      123456
      aa bb c [ddd
           eeeeeeeeeeeeeeeeeeeeeeeee
           ff
           ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(6, 5);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeeeeeeeeeeeeeeeeeeeeeeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n     eeeeeeeeeeeeeeeeeeeeeeeee\n     ff\n     ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("7/@[<h>aa@ bb@ c@ @[[ddd@ eeeeeeeeeeeeeeeeeeeeeeeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 4 (the first line-break in the box has never enough room)
    /* 
      1234567
      aa bb c [ddd
            eeeeeeeeeeeeeeeeeeeeeeeee
            ff
            ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(7, 6);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeeeeeeeeeeeeeeeeeeeeeeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n      eeeeeeeeeeeeeeeeeeeeeeeee\n      ff\n      ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("9/@[<h>aa@ bb@ c@ @[[ddd@ eeeeeeeeeeeeeeeeeeeeeeeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 4 (the first line-break in the box has never enough room)
    /* 
      123456789
      aa bb c [ddd
              eeeeeeeeeeeeeeeeeeeeeeeee
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(9, 8);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeeeeeeeeeeeeeeeeeeeeeeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeeeeeeeeeeeeeeeeeeeeeeee\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("11/@[<h>aa@ bb@ c@ @[[ddd@ eeeeeeeeeeeeeeeeeeeeeeeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 4 (the first line-break in the box has never enough room)
    /* 
      12345678901
      aa bb c [ddd
              eeeeeeeeeeeeeeeeeeeeeeeee
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(11, 10);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeeeeeeeeeeeeeeeeeeeeeeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeeeeeeeeeeeeeeeeeeeeeeee\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("12/@[<h>aa@ bb@ c@ @[[ddd@ eeeeeeeeeeeeeeeeeeeeeeeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 4 (the first line-break in the box has never enough room)
    /* 
      123456789012
      aa bb c [ddd
              eeeeeeeeeeeeeeeeeeeeeeeee
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(12, 11);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ eeeeeeeeeeeeeeeeeeeeeeeee@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        eeeeeeeeeeeeeeeeeeeeeeeee\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("9/@[<h>aa@ bb@ c@ @[[ddd@ @[[ee@ ee@ e@ ee@ ee]@]@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 4-A (the too narrow first line-break caused by a shrinkable box)
    /* 
      123456789
      aa bb c [ddd
              [ee
              ee
              e
              ee
              ee]
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(9, 8);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ @[[ee@ ee@ e@ ee@ ee]@]@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        [ee\n        ee\n        e\n        ee\n        ee]\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("11/@[<h>aa@ bb@ c@ @[[ddd@ @[[ee@ ee@ e@ ee@ ee]@]@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 4-A (the too narrow first line-break caused by a shrinkable box)
    /* 
      12345678901
      aa bb c [ddd
              [ee
              ee
              e
              ee
              ee]
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(11, 10);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ @[[ee@ ee@ e@ ee@ ee]@]@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        [ee\n        ee\n        e\n        ee\n        ee]\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("13/@[<h>aa@ bb@ c@ @[[ddd@ @[[ee@ ee@ e@ ee@ ee]@]@ ff@ ggggggggg]@]@ h@ i@ j@]@.", function () {
    // hbox to box 4-A (the too narrow first line-break caused by a shrinkable box)
    /* 
      1234567890123
      aa bb c [ddd
              [ee
              ee e
              ee
              ee]
              ff
              ggggggggg] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(13, 12);
    var formatted = ppf.printf("@[<h>aa@ bb@ c@ @[[ddd@ @[[ee@ ee@ e@ ee@ ee]@]@ ff@ ggggggggg]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd\n        [ee\n        ee e\n        ee\n        ee]\n        ff\n        ggggggggg] h i j";
    expect(formatted).equal(expected);
  });

  it("13/@[aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    // box to box
    /* 
      1234567890123
      aa bb c
      [ddd eeee f
      g] h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(13, 12);
    var formatted = ppf.printf("@[aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa bb c\n[ddd eeee f\ng] h i j";
    expect(formatted).equal(expected);
  });

  it("17/@[aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    // box to box
    /* 
      12345678901234567
      aa bb c
      [ddd eeee f g] h
      i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(17, 16);
    var formatted = ppf.printf("@[aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa bb c\n[ddd eeee f g] h\ni j";
    expect(formatted).equal(expected);
  });

  it("23/@[aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.", function () {
    // box to box
    /* 
      12345678901234567890123
      aa bb c [ddd eeee f g]
      h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(23, 22);
    var formatted = ppf.printf("@[aa@ bb@ c@ @[[ddd@ eeee@ f@ g]@]@ h@ i@ j@]@.");
    var expected = "aa bb c [ddd eeee f g]\nh i j";
    expect(formatted).equal(expected);
  });

  it("5/@[<hv>aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.", function () {
    
    /* 
      12345
      aa
      bb
      c
      dddd
      eeee
      f
      gg
      h
      i
      j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(5, 4);
    var formatted = ppf.printf("@[<hv>aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.");
    var expected = "aa\nbb\nc\ndddd\neeee\nf\ngg\nh\ni\nj";
    expect(formatted).equal(expected);
  });

  it("20/@[<hv>aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.", function () {
    
    /* 
      12345678901234567890
      aa
      bb
      c
      dddd
      eeee
      f
      gg
      h
      i
      j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(20, 19);
    var formatted = ppf.printf("@[<hv>aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.");
    var expected = "aa\nbb\nc\ndddd\neeee\nf\ngg\nh\ni\nj";
    expect(formatted).equal(expected);
  });

  it("40/@[<hv>aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.", function () {
    
    /* 
      1234567890123456789012345678901234567890
      aa bb c dddd eeee f gg h i j
     */
    var ppf = new pp.StringFormatter();
    ppf.setMargin(40, 39);
    var formatted = ppf.printf("@[<hv>aa@ bb@ c@ dddd@ eeee@ f@ gg@ h@ i@ j@]@.");
    var expected = "aa bb c dddd eeee f gg h i j";
    expect(formatted).equal(expected);
  });

});

