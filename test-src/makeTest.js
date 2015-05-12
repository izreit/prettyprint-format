// vim: set ts=2 sts=2 sw=2 et ai:

var fs = require("fs");
var path = require("path");
var child_process = require("child_process");
var ECT = require("ect");

function makeAnswer(m, s) {
  s = s.replace(/([<>;])/g, function (m) { return "\\" + m; });
  var cmd = "echo open Format\\;\\; "
          +      "set_margin " + m + "\\;\\; "
          +      "set_max_indent " + (m - 1) + "\\;\\; "  // set_margin implicitly modified this value non-trivially...
          +      "printf \\\"" + s + "\\\" | "
          + "ocaml -stdin";
  var result = child_process.execSync(cmd).toString();
  return result.substr(0, result.length - 1); // remove trailing newline.
}

var renderer = ECT({ root: __dirname });
var dataFilePath = path.join(__dirname, "testDataSet.json");
var content = fs.readFileSync(dataFilePath, "utf8");

var testCases = [];

JSON.parse(content).forEach(function (t) {
  var margins = (typeof t.margin === "number") ? [t.margin] : t.margin;
  margins.forEach(function (m) {
    var ans = makeAnswer(m, t.source);
    testCases.push({
      name: JSON.stringify((t.name ? (t.name + ":") : "") + (m + "/" + t.source)),
      comment: t.comment,
      margin: m,
      source: JSON.stringify(t.source),
      expected: JSON.stringify(ans),
      rawExpected: ans,
    });
  });
});

var generated = renderer.render("template.ect", { testCases: testCases });
var outFilePath = path.join(__dirname, "..", "test", "printf.spec.js");
fs.writeFileSync(outFilePath, generated, "utf8");
console.log("Done!");

