prettyprint-format
==================

[![Build Status](https://travis-ci.org/kizz/prettyprint-format.svg)](https://travis-ci.org/kizz/prettyprint-format)

prettyprint-format is a JavaScript general-purpose pretty-printing library
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
- User-defined pretty-printer
- No runtime dependencies
- Bonus: JSON.stringify()-like object dumper, more condensed and readable

Installation
------------

For Node.js:

    npm install prettyprint-format

For browsers: (use the included packed file)

    <script type="text/javascript" src="prettyprint-format.js"></script>

Usage
-------

In typical cases, the only functions you want to call are `Format.printf()`,
`Format.sprintf()` and setters of their margins (`Format.setMargin()` and
`Format.setStrMargin()`).

To learn the extended escape sequences of `printf()`, you should read the
article "[Using the Format module](https://ocaml.org/learn/tutorials/format.html)"
especially if you are not familier with OCaml's
[Format](http://caml.inria.fr/pub/docs/manual-ocaml/libref/Format.html) module.
The article explains the concept of "box" and "break hints."

prettyprint-format provides similar API to Format module with slight changes:

- Written in lowerCamelCase and object-oriented style.
    - e.g. `Formatter` class instead of `formatter` type
    - e.g. `fmtr.openHvbox(0)` instead of `pp_open_hvbox fmtr 0`
- Supports almost espace sequences for `printf()` with additional ones.
- No rarely-used methods, no deprecated ones.
- Not implemented: semantic tags and tabulations.

Example
-------

(will be written.)

API Documentation
-----------------

This library mainly consists of the two parts:

 * `Format`: the library's root.  Provides all public methods and classes.
 * `Formatter`: the core class implementing pretty-printing routine.
   Assigned to `Fromat.Formatter`.

#### Format

##### Format.printf(format, ...)

Format the arguments according to the given format string `format` and print
the result by `console.log()`.  See the section of `Formatter#printf()` for
the detailed syntax of `format`.

This is an alias of `Format.stdFormatter.printf()`.

NOTE (especially for OCaml users): because of `console.log()`, the result
string automatically followed by a newline.  You may want to use "@?" to
flush but not "@." that produces another newline.

##### Format.sprintf(format, ...)

Same with `Format.printf()` except it does not print anything to `console`
but returns a string containing the format result.  This is an alias of
`Format.strFormatter.printf()`.


##### Format.setMargin(margin, maxIndent = 0)

Set the margin and optionally the max indent for `Format.printf()`.
This is an alias of `Format.stdFormatter.setMargin()`.  See `Formatter.setMargin()`.

##### Format.getMargin()

Return the margin for `Format.printf()`.
Alias of `Format.stdFormatter.getMargin()`.

##### Format.setMaxIndent(maxIndent)

Set the max indent for `Format.printf()`.
Alias of `Format.stdFormatter.setMaxIndent()`.

##### Format.getMaxIndent()

Return the max indent for `Format.printf()`.
Alias of `Format.stdFormatter.getMaxIndent()`.

##### Format.setStrMargin(), getStrMargin(), setStrMaxIndent(), getStrMaxIndent()

Same with `Format.setMargin()`, `getMargin()`, `setMaxIndent()` and
`getMaxIndent()` respectively, except that they works for `Format.sprintf()`.
Aliasses of the methods with same names of `Format.strFormatter`.

##### Format.stringify(obj, options = {})

Returns a string representing of JSON object `obj`.

A utility method to stringify a JSON object like `JSON.stringify()` but
in more condensed format, since this function is aware of the margin information.
`options` can be a number or an object. If it's a number then it is used as
the margin. Otherwise, the object will be passed to the constructor of `Formatter`.

NOTE that currently cyclic object is not supported.  They may cause infinite loops.

#### Formatter

Can be obtained by `Format.Formatter`.
Most of the description for the class is largely based on the the document of
OCaml's Format module and Printf module.

##### new Formatter(options)

Returns a new instance of `Formatter`.
The argument `options`, optional, is an object has zero ore more following properties:

 * `margin`: the margin of a line.  Namely, a line is considered as "bleed out"
   when it includes more characters than `margin`.  Ignored if less than 2.
   Default: 80.
 * `maxIndent`: the limitation to indentation depth. No indentation can be deeper
   than this value, even if the innermost box is opened at more deeper position.
   Ignored if less than 2.  Default: 0.
 * `onString`: the function called whenever the formatter prints a string literal.
   Takes one argument, a string to be printed.  If specified, the return value of
   this function is printed instead of the original string.
 * `onNewline`: the function called whenever the formatter prints a newline caused by
   break hints.  Takes no arguments.  If specified, the return value of this function
   is printed instead of default newline character, "\n".
 * `onSpace`: the function called whenever the formatter prints whitespaces caused by
   break hints.  Takes an argument, a number of whitespaces should be printed.
   If specified, the return value of this function is printed instead of whitespaces.
 * `onFlush`: the function called whenever the formatter is requested to flush.
   Takes no arguments.  Its return value is ignored.
 * `onFinish`: the function called at the end of the toplevel (outmost) printf() call.
   It takes one argument, a string which is the format result.  The return value
   of the function is ignored.

##### Formatter#printf(format, ...)

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
 * `S`: convert a string argument to JavaScript string literal (i.e. JSON.stringify()-ed).
 * `f`: convert a number argument to floating-point decimal notation (e.g. 42.195).
 * `e`: convert a number argument to sientific notation (e.g. 4.2195e+1).
 * `E`: same as `e` except that uses an uppercase "E" (e.g. 4.2195E+1).
 * `g`: same as `f` or `e`, which is more shorter one for the number.
 * `G`: same as `g` but for `f` and `E`.
 * `B`: convert a boolean argument to the string "true" or "false".
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
 * `%`: take no argument and output one "%" character.
 * `@`: take no argument and output one "@" character.
 * `,`: take no argument and output nothing: a no-op delimiter for conversion specification.

The optional `flags` are:

 * `-`: left-justfy the output.
 * `0`: for numeriacal conversions, pad with zeroes instead of whitespaces.
 * `+`: for numberical conversions, prefix the number with a "+" sign, if it is positive.
 * ` ` (whitespace): for numberical conversions, prefix the number with a whitespace, if it is positive.

The optional `width` is an integer indicating the minimal width of the result.
For instance, `%6d` prints a number, prefixing it with spaces to fill at least 6 characters.

The optional `precision` is an integer following to a dot ".", indicating how many digits
follow the decimal point in the `%f`, `%e`, and `%E` conversions.  For instance,
`%.4f` prints a float with 4 fractional digits.

The integer in a width or precision can also be specified as "\*", in which case
an extra number argument is taken to specify the corresponding width or precision.
This integer argument precedes immediately the argument to print.  For instance,
%.\*f prints a number with as many cractional digits as the value of the argument
given before the number.

Pretty-printing indications are `@` followed by one ore more characters.
Their meanings are:

 * `@[`: open a pretty-printing box. The type and offset of the box may be optionally
   specified with the following form: "@[<_(box type)_ _(offset)_>".  Box type is one of
   "h", "v", "hv", or "hov", which stand respectively for an horizontal box, a vertical box,
   an 'horizontal-vertical' box, or an 'horizontal or vertical' box. For instance,
   "@[&lt;hov 2&gt;" opens an 'horizontal or vertical' box with indentation 2 as obtained with
   `Formatter#openHovbox(2)`. For more details about boxes, see the various box opening
   functions `Formatter#open*box()`.
 * `@]`: close the most recently opened pretty-printing box.
 * `@,`: output a good break hint, as with `Formatter#printCut()`.
 * `@ `: output a good break space, as with `Formatter#printSpace()`.
 * `@;`: output a fully specified good break as with `Formatter#printBreak()`.  The `nspaces`
   and `offset` parameters of the break may be optionally specified with the following form:
   "@;<_(nspace)_ _(offset)_>".  If no parameters are provided, the good break defaults to
   a good break space.
 * `@.`: flush the pretty-printer and output a new line, as with print_newline ().
 * `@?`: flush the pretty-printer as with print_flush (). This is equivalent to the conversion %!.
 * `@\n`: force a newline, as with force_newline ().
 * `@@`: print a single @ character.

##### Formatter#setMargin(margin, maxIndent = 0)

Set the margin, and optionally set the max indent of `this`.

Set the margin of a line to `margin`.  A line is considered as "bleed out"
when it includes more characters than `margin`.  Ignored if the value is
less than 2.

Also set the max indent of a line to `maxIndent`, if given.  Ignored if
the value is less than 2.

##### Formatter#getMargin()

Return the current margin of `this`.

##### Formatter#setMaxIndent(maxIndent)

Set the max indent of a line to `maxIndent`, if given.  Ignored if the value
is less than 2.

##### Formatter#getMaxIndent()

Return the current max indent of `this`.

##### Formatter#setMaxBoxes(num)

Set the maximum number of boxes simultaneously opened to `num`.  Material inside
boxes nested deeper is printed as an ellipsis (more precisely as the string
returned by `Formatter#getEllipsisText()`).  Ignored if the value is less than 2.

NOTE: To compatible with OCaml, Formatter considers two boxes are already opened
at the initial state.  You may want to add 2 to the number actually you need.

##### Formatter#getMaxBoxes()

Return the maximum number of boxes allowed before ellipsis.

##### Formatter#overMaxBoxes()

Return whether the box have already been opened reaches the limitation or not.

##### Formatter#setEllipsisText(str)

Set the text of the ellipsis printed when too many boxes are opened.
Default value is a single dot (".").

##### Formatter#getEllipsisText()

Retrun the text of the ellipsis.

##### Formatter#openBox(additionalIndent)

Open a new pretty-printing box with offset `additionalIndent`. This box is the
general purpose pretty-printing box. Material in this box is displayed
'horizontal or vertical': break hints inside the box may lead to a new line,
if there is no more room on the line to print the remainder of the box,
or if a new line may lead to a new indentation (demonstrating the indentation
of the box). When a new line is printed in the box, `additionalIndent` is added
to the current indentation.

##### Formatter#openHbox()

Open a new pretty-printing box.  This box is 'horizontal': the line is not
split in this box (new lines may still occur inside boxes nested deeper).

##### Formatter#openVbox(additionalIndent)

Open a new pretty-printing box with offset `additionalIndent`.  This box is
'vertical': every break hint inside this box leads to a new line.  When a new
line is printed in the box, `additionalIndent` is added to the current indentation.

##### Formatter#openHvbox(additionalIndent)

Open a new pretty-printing box with offset `additionalIndent`. This box is
'horizontal-vertical': it behaves as an 'horizontal' box if it fits on a single line,
otherwise it behaves as a 'vertical' box.  When a new line is printed in the box,
`additionalIndent` is added to the current indentation.

##### Formatter#openHovbox(additionalIndent)

Open a new pretty-printing box with offset `additionalIndent`. This box is
'horizontal or vertical': break hints inside this box may lead to a new line,
if there is no more room on the line to print the remainder of the box. When
a new line is printed in the box, `additionalIndent` is added to the current
indentation.

##### Formatter#closeBox()

Close the most recently opened pretty-printing box.

##### Formatter#printInt(n), printString(s), printNumber(n), printBool(b)

Print the argument in the current box as a floored number, a string,
a number or a boolean respectively.

##### Formatter#printSpace()

Print a whitespace that indicates that the line may be split at this point.
When the line is splitted, no whitespace are printed.  Equivalent to
`this.printBreak(1, 0)`.

##### Formatter#printCut()

Indicate that the line may be split at this point.  It either prints nothing
or splits the line.  This allows line splitting at the current point, without
printing spaces or adding indentation.  Equivalent to `this.printBreak(0, 0)`.

##### Formatter#printBreak(nspaces, offset)

Insert a break hint in the current box.  It indicates that the line may be
split at this point, if the contents of the current box does not fit on the
current line.  If the line is split at that point, `offset` is added to the
current indentation. If the line is not split, `nspaces` spaces are printed.

##### Formatter#printFlush()

Flush the pretty-printer: all opened boxes are closed, all pending text
are passed to handlers `onString`, `onSpace` or `onNewline` which are passed
to the constructor, and the `flush` handler is called.

##### Formatter#printNewline()

Equivalent to `this.printFlush()` followed by a newline.

##### Formatter#forceNewline()

Force a newline in the current box.  The indentation of the box still works.
Not the normal way of pretty-printing, you should prefer break hints.

##### Formatter#finishPrint()

Obtain the pretty-printing result after flushing the pretty-printer.  You can
call this method to obtain the final result when you use low-level functions
(like `openBox()`, `closeBox()`, `printString()` and so on) but not `printf()`.

`printf()` calls this function and returns its result automatically.  So in
many case you do not need to call this function.

Not in OCaml.  Must be called after all boxes are closed.

Incompatiblity with OCaml
------------------------

(If you are not famillier with OCaml's Format module, just ignore this section.)

Printing results may not be identical to OCaml's corresponding code.
It because not only this library is still in development but also this library
does not aim to be 100% compatible to OCaml.

#### No need to flush

We provide some escape sequences that indicate to "flush" the buffer, such as "@.",
"@?" or "%!". But they are actually not absolutely necessary ones in prettyprint-format.
Even no flushing is requested, we automatically flush at last by counting the nest
level of `printf()`.

This is because the way we print a string to console is `console.log()` that always
prints the following newline.  This means we cannot flush intermediate format result
especially when the formatter has a customized newline (via Formatter's constructor
option: `onNewline`).

#### Formatter#setMargin() and pp\_set\_margin

Unlike its name, our `Formatter#setMargin()` takes two arguments called
`margin` and optional `maxIndent` while `pp_set_margin` in OCaml takes
just one argument.  Our second argument is used to call `setMaxIndent`,
as its name suggests.

This is an intentional incompatibility.  Because we found that calling
`pp_set_margin` changes the max indent value implicitly in non-trivial,
undocumented and unseeable way.  Instead of emulating that behaviour,
we offer the explicit way to specify the max indent value when you change
the margin value.

#### Unsupported features

We do not have the following features (currently, at least):

 * Semantic tags. (i.e. `open_tag ()` and related functions)
 * `@<n>`, a pritty-printing indication.
 * Tabulation. (i.e. `open_tbox ()` and related functions)

