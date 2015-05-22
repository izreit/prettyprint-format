prettyprint-format
==================

prettyprint-format is a JavaScript general-purpose pretty print library
modeled after [OCaml](http://ocaml.org/)'s
[Format](http://caml.inria.fr/pub/docs/manual-ocaml/libref/Format.html) module.
Using its extended `printf()`  you can format your text, object or
any data structure you defnined with automatic line break and indentation.

    var Format = require("prettyprint-format");
    Format.setMargin(20);
    Format.printf("Text:@ @[lorem@ ipsum@ dolor@ sit@ amet,@ consectetur@ ...@]@.");

will print:

    Text: lorem ipsum
          dolor sit
          amet,
          consectetur
          ...

Features
--------

- Automatic line break and indentation
- Highly customizable output
- User-defined pretty printer
- No dependencies
- Bonus: JSON.stringify()-like object dumper, more condensed and readable

Installation
------------

For Node.js:

    npm install prettyprint-format

Usage
-------

If you are not familier with OCaml's Format module you should read the article
"[Using the Format module](https://ocaml.org/learn/tutorials/format.html)"
that explains the concept of "box" and "break hints."  prettyprint-format provides
similar API to [Format](http://caml.inria.fr/pub/docs/manual-ocaml/libref/Format.html)
module with slight changes.

- Written in lowerCamelCase and object-oriented style.
    - e.g. `Formatter` class instead of `formatter` type
    - e.g. `Formatter#openHvbox()` instead of `(pp_open_hvbox formatter ())`
- Supports almost espace sequences for `printf()` with additional ones.
- No rarely-used methods, no deprecated ones.
- Not implemented: semantic tags, tabulations, formatting depth and ellipsis.

Example
-------

(will be written.)

API Documentation
-----------------

This library mainly consists of the two object:

 * `Format`: the library's root. Provides all public methods and classes.
 * `Formatter`: the core class implementing pretty printing routine. Assigned to `Fromat.Formatter`.

`Format` provides simple API

#### Format

###### Format.printf(format, ...)

Format the arguments according to the given string `format` and print
the result string by `console.log()`.

###### Format.sprintf(format, ...)

Same with `Format.printf()` except it does not print anything to `console`
but returns a string containing the format result.  An alias of
`Format.defaultFormatter.sprintf()`.

