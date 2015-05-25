// vim: set ts=2 sts=2 sw=2 et ai si:

var expect = require("chai").expect;
var pp = require("../lib/");

describe("stringify", function () {

  function test(margin, obj, expectedArray) {
    var actual = pp.stringify(obj, margin);
    expect(actual).to.equal(expectedArray.join("\n"));
  }

  it("[]", function () {
    var o = [];

    var expected = ['[]'];
    test(5, o, expected);
    test(20, o, expected);
    test(30, o, expected);
    test(40, o, expected);
  });

  it("[1]", function () {
    var o = [1];
    var expected;

    expected =
      ['[',
       '  1',
       ']'];
    test(5, o, expected);

    expected = ['[ 1 ]'];
    test(20, o, expected);
    test(30, o, expected);
    test(40, o, expected);
  });

  it("[1,2]", function () {
    var o = [1, 2];
    var expected;

    expected =
      ['[',
       '  1,',
       '  2',
       ']'];
    test(5, o, expected);

    expected = ['[ 1, 2 ]'];
    test(20, o, expected);
    test(30, o, expected);
    test(40, o, expected);
  });

  it('[1,200,-300,104.5,"fooo","baaaar",2]', function () {
    var o = [1,200,-300,104.5,"fooo","baaaar",2];
    var expected;

    expected =
      ['[',
       '  1,',
       '  200,',
       '  -300,',
       '  104.5,',
       '  "fooo",',
       '  "baaaar",',
       '  2',
       ']'];
    test(5, o, expected);
    expected =
      ['[',
       '  1, 200, -300,',
       '  104.5, "fooo",',
       '  "baaaar", 2',
       ']'];
    test(20, o, expected);
    expected =
      ['[',
       '  1, 200, -300, 104.5,',
       '  "fooo", "baaaar", 2',
       ']'];
    test(30, o, expected);
    expected =
      ['[',
       '  1, 200, -300, 104.5, "fooo",',
       '  "baaaar", 2',
       ']'];
    test(40, o, expected);
  });


  it("{}", function () {
    var o = {};
    var expected;

    expected = ['{}'];
    test(5, o, expected);
    test(20, o, expected);
    test(30, o, expected);
    test(40, o, expected);
  });

  it('{"t":1}', function () {
    var o = { t: 1 };
    var expected;

    expected =
      ['{',
       '  "t": 1',
       '}'];
    test(5, o, expected);
    expected = ['{ "t": 1 }'];
    test(20, o, expected);
    test(30, o, expected);
    test(40, o, expected);
  });

  it('{"t":1,"arr":["foo","bar","zoo"],"someproperty":{}};', function () {
    var o = {"t":1,"arr":["foo","bar","zoo"],"someproperty":{}};
    var expected;

    expected =
      ['{',
       '  "t": 1,',
       '  "arr": [',
       '    "foo",',
       '    "bar",',
       '    "zoo"',
       '  ],',
       '  "someproperty": {}',
       '}'];
    test(5, o, expected);
    expected =
      ['{',
       '  "t": 1,',
       '  "arr": [',
       '    "foo", "bar",',
       '    "zoo"',
       '  ],',
       '  "someproperty": {}',
       '}'];
    test(20, o, expected);
    expected =
      ['{',
       '  "t": 1,',
       '  "arr": [',
       '    "foo", "bar", "zoo"',
       '  ],',
       '  "someproperty": {}',
       '}'];
    test(30, o, expected);
    expected =
      ['{',
       '  "t": 1,',
       '  "arr": [ "foo", "bar", "zoo" ],',
       '  "someproperty": {}',
       '}'];
    test(40, o, expected);
  });

  it('{"t":1,"arr":["foo","bar","zoo"],"someproperty":{"cold":false}}', function () {
    var o = {"t":1,"arr":["foo","bar","zoo"],"someproperty":{"cold":false}};
    var expected;

    expected =
      ['{',
       '  "t": 1,',
       '  "arr": [',
       '    "foo",',
       '    "bar",',
       '    "zoo"',
       '  ],',
       '  "someproperty": {',
       '    "cold": false',
       '  }',
       '}'];
    test(5, o, expected);
    expected =
      ['{',
       '  "t": 1,',
       '  "arr": [',
       '    "foo", "bar",',
       '    "zoo"',
       '  ],',
       '  "someproperty": {',
       '    "cold": false',
       '  }',
       '}'];
    test(20, o, expected);
    expected =
      ['{',
       '  "t": 1,',
       '  "arr": [',
       '    "foo", "bar", "zoo"',
       '  ],',
       '  "someproperty": {',
       '    "cold": false',
       '  }',
       '}'];
    test(30, o, expected);
    expected =
      ['{',
       '  "t": 1,',
       '  "arr": [ "foo", "bar", "zoo" ],',
       '  "someproperty": { "cold": false }',
       '}'];
    test(40, o, expected);
  });

  it('{"ar":["some",{"zee":[[100,200,42,-5]],"taa":{"f":1}},"zoo"],"tee":{"cold":false}}', function () {
    var o = {"ar":["some",{"zee":[[100,200,42,-5]],"taa":{"f":1}},"zoo"],"tee":{"cold":false}};
    var expected;

    expected =
      ['{',
       '  "ar": [',
       '    "some",',
       '    {',
       '      "zee": [',
       '        [',
       '          100,',
       '          200,',
       '          42,',
       '          -5',
       '        ]',
       '      ],',
       '      "taa": {',
       '        "f": 1',
       '      }',
       '    },',
       '    "zoo"',
       '  ],',
       '  "tee": {',
       '    "cold": false',
       '  }',
       '}'];
    test(5, o, expected);
    expected =
      ['{',
       '  "ar": [',
       '    "some",',
       '    {',
       '      "zee": [',
       '        [',
       '          100, 200,',
       '          42, -5',
       '        ]',
       '      ],',
       '      "taa": {',
       '        "f": 1',
       '      }',
       '    }, "zoo"',
       '  ],',
       '  "tee": {',
       '    "cold": false',
       '  }',
       '}'];
    test(20, o, expected);
    expected =
      ['{',
       '  "ar": [',
       '    "some",',
       '    {',
       '      "zee": [',
       '        [ 100, 200, 42, -5 ]',
       '      ],',
       '      "taa": { "f": 1 }',
       '    }, "zoo"',
       '  ],',
       '  "tee": { "cold": false }',
       '}'];
    test(30, o, expected);
    expected =
      ['{',
       '  "ar": [',
       '    "some",',
       '    {',
       '      "zee": [ [ 100, 200, 42, -5 ] ],',
       '      "taa": { "f": 1 }',
       '    }, "zoo"',
       '  ],',
       '  "tee": { "cold": false }',
       '}'];
    test(40, o, expected);
  });

});
