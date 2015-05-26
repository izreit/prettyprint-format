prettyprint-format
==================

prettyprint-format is a JavaScript general-purpose pretty print library
modeled after [OCaml](http://ocaml.org/)'s
[Format](http://caml.inria.fr/pub/docs/manual-ocaml/libref/Format.html) module.
Using its extended `printf()` you can format your text, object or
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

If you are not familier with OCaml's
[Format](http://caml.inria.fr/pub/docs/manual-ocaml/libref/Format.html) module
you should read the article "[Using the Format module](https://ocaml.org/learn/tutorials/format.html)"
that explains the concept of "box" and "break hints."  prettyprint-format provides
similar API to Format module with slight changes:

- Written in lowerCamelCase and object-oriented style.
    - e.g. `Formatter` class instead of `formatter` type
    - e.g. `Formatter#openHvbox()` instead of `(pp_open_hvbox formatter ())`
- Supports almost espace sequences for `printf()` with additional ones.
- No rarely-used methods, no deprecated ones.
- Not implemented: semantic tags, tabulations, formatting depth and ellipsis.

In general, the only methods you want to know are `Format.printf()`, `Format.sprintf()`
and setters of their margins (`Format.setMargin()` and `Format.setStrMargin()`).

Example
-------

(will be written.)

API Documentation
-----------------

This library mainly consists of the two parts:

 * `Format`: the library's root.  Provides all public methods and classes.
 * `Formatter`: the core class implementing pretty print routine.  Assigned to `Fromat.Formatter`.

#### Format

###### Format.printf(format, ...)

Format the arguments according to the given format string `format` and print
the result by `console.log()`.  See the section of `Formatter#printf()` for
the detailed syntax of `format`.

This is an alias of `Format.stdFormatter.printf()`.

NOTE (especially for OCaml users): because of `console.log()`, the result
string automatically followed by a newline.  You may want to use "@?" to
flush but not "@." that produces another newline.

###### Format.sprintf(format, ...)

Same with `Format.printf()` except it does not print anything to `console`
but returns a string containing the format result.  This is an alias of
`Format.strFormatter.printf()`.


### Formatter

Can be obtained by `Format.Formatter`.

###### new Formatter(options)

Returns a new instance of `Formatter`.
The argument `options`, optional, is an object has zero ore more following properties:

 * `margin`: the margin of a line.  Namely, a line is considered as "bleed out"
   when it includes more characters than `margin`.  This value can be accessed
   by `Formatter#setMargin()` or `getMargin()`.  Default: `80`.
 * `maxIndent`: the limitation to indentation depth. No indentation can be deeper
   than this value, even if the innermost box is opened at more deeper position.
   Ignored if less than `2`.  This value can be accessed by `Formatter#setMaxIndent()`
   and `Formatter#getMaxIndent()`.  Default: `0`.
 * `onString`: the function called whenever the formatter prints a string literal.
   Takes one argument, a string to be printed.  If specified, the return value of
   this function is printed instead of the original string.
 * `onNewline`: the function called whenever the formatter prints a newline.
   Takes no arguments.  If specified, the return value of this function is printed
   instead of default newline character, "\n".
 * `onSpace`: the function called whenever the formatter prints whitespaces
   caused by break hints.  Takes an argument, a number of whitespaces should be
   printed.  If specified, the return value of this function is printed instead
   of whitespaces.
 * `onFlush`: the function called whenever the formatter is requested to flush.
   Takes no arguments.  Its return value is ignored.
 * `onFinish`: the function called at the end of the toplevel (outmost) printf() call.
   It takes one argument, a string which is the format result.  The return value
   of the function is ignored.

###### Formatter#printf(format, ...)

Format the arguments according to the given format string `format`.

The format string consists of three kinds of objects:
plain characters, conversion specifications, and pretty-printing indications.

Plain characters are just printed.  Conversion specifications are not printed
themselves but cause conversion and printing arguments.  Pretty-printing
indications annotate the string for automatic line-break and indentation.

Conversion specifications are a `%` character followed by optional parameters
(flags, width and precision) and the type.  In other words they have the form
`% [flags][width][.precision]type`.

The `type` can be one of the following characters:

 * `d`, `i`: convert a number to floored decimal value.
 * `x`: convert a number to signed hexadecimal value, with lowercase letters.
 * `X`: convert a number to signed hexadecimal value, with uppercase letters.
 * `o`: convert a number to signed octal.
 * `s`: take a string and just insert it without any conversion.
 * `S`: convert a string argument to JavaScript string literal (i.e. `JSON.stringify()`-ed).
 * `f`: convert a number argument to floating-point decimal notation (e.g. `42.195`).
 * `e`: convert a number argument to sientific notation (e.g. `4.2195e+1`).
 * `E`: same as `e` except that uses an uppercase `E` (e.g. `4.2195E+1`).
 * `g`: same as `f` or `e`, which is more shorter one for the number.
 * `G`: same as `g` but for `f` and `E`.
 * `B`: convert a boolean argument to the string `true` or `false`.
 * `a`: user-defined printer.  Take two arguments, say `fun` and `value`.
   `fun` must be a function and called with two arguments: `this` (a `Formatter`)
   and `value`.  The output produced by the function is inserted in the output
   of `printf()` at the current point.
 * `t`: same as `%a`, but take just one argument: `fun`.  The function `fun` called
   with only one argument `this`. (i.e. `fun(this)`)
 * `A`: (not in OCaml) same as `%a`, but the second argument, `value`, is used as `this`
   value to call the function but not as an argument. (i.e. `fun.call(value, this)`)
 * `T`: (not in OCaml) user-defined printer.  Take one argument, say `obj`.
   `obj` must have a function property named `pp`.  The output produced by calling
   `obj.pp(this)` is inserted in the output of `printf()` at the current point.
 * `!`: take no argument.  Flush the output.
 * `%`: take no argument and output one `%` character.
 * `@`: take no argument and output one `@` character.
 * `,`: take no argument and output nothing: a no-op delimiter for conversion specification.

The optional `flags` are:

 * `-`: left-justfy the output.
 * `0`: for numeriacal conversions, pad with zeroes instead of whitespaces.
 * `+`: for numberical conversions, prefix the number with a `+` sign, if it is positive.
 * (whitespace): for numberical conversions, prefix the number with a whitespace, if it is positive.

The optional `width` is an integer indicating the minimal width of the result.
For instance, `%6d` prints a number, prefixing it with spaces to fill at least 6 characters.

The optional `precision` is an integer following to a dot `.`, indicating how many digits
follow the decimal point in the `%f`, `%e`, and `%E` conversions.  For instance,
`%.4f` prints a float with 4 fractional digits.

(Note for OCaml Users: asterisks `*` for `width` and `precision` is currently not supported.)

Pretty-printing indications are `@` followed by one ore more characters.
Their meanings are:

(will be written.)

