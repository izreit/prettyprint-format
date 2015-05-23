// vim: set ts=2 sts=2 sw=2 et ai:

var fs = require("fs");
var path = require("path");
var child_process = require("child_process");
var ECT = require("ect");

var dataFilePath = path.join(__dirname, "./dataset-numberToString.json");
var outFilePath = path.join(__dirname, "../test/autogen-numberToString.spec.js");

var renderer = ECT({ root: __dirname });
var content = fs.readFileSync(dataFilePath, "utf8");

var testCases = [];

JSON.parse(content).forEach(function (t) {
  testCases.push({
    name: JSON.stringify(JSON.stringify(t)),
    expected: JSON.stringify(t[0]),
    num: t[1],
    flags: t[2] ? JSON.stringify(t[2]) : "undefined",
    width: t[3] ? JSON.stringify(t[3]) : "undefined",
    prec: t[4] ? JSON.stringify(t[4]) : "undefined",
    type: JSON.stringify(t[5]),
  });
});

var generated = renderer.render("template-numberToString.ect", { testCases: testCases });
fs.writeFileSync(outFilePath, generated, "utf8");
console.log("Done!");

