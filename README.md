# docblock-parser [![Build Status](https://travis-ci.org/fkling/docblock-parser.svg?branch=master)](https://travis-ci.org/fkling/docblock-parser)

A line based doc block parser.

## Motivation

I wasn't able to find a standalone, not opinionated docblock parser. Most
parsers seem to make fixed assumptions about the value of a tag.
This is a slightly less opinionated parser. It allows you to specify which parts
of a tag make up its value, on a line basis.

## Quick example

```js
> var docblockParser = require('docblock-parser');
> docblockParser.parse('/** @type {Object} */');
{ text: '',
  tags: { type: '{Object} Description' } }
```

## Terminology

The parser is built around the idea of *consuming lines*. If the parser
encounters a line that starts with a tag pattern (`@tagname`), it delegates the
consumption of the following lines to a tag specific **consumer** or the default
consumer. If the line doesn't start with a tag, it delegates to the text
consumer.

A **consumer** is a function that accepts a `Docblock` object and returns a
value which is associated with the tag or free text.

A **`Docblock`** object is just a stack of lines, with which a consumer can
`.peek()` at the current line or `.pop()` it from the stack to consume it.
A consumer `.pop()`s lines until a condition is met (or there no lines left).

## Install

```sh
npm install docblock-parser
```
## API

#### `docblockParser.parse(docstring)`

This parses `docstring` with the default configuration (`defaultConfig.js`)
which provides sensible defaults for [jsdoc
tags](https://code.google.com/p/jsdoc-toolkit/wiki/TagReference).

#### `docblockParser(config).parse(docstring)`

Allows you to specific your own consumers and tags.

##### `config.docBlockPattern`

Type: `RegExp`

The pattern to validate a docblock. Defaults to `/^\/\*\*|^\s*\* ?/m`.

##### `config.startPattern`

Type: `RegExp`

The start of docblock. The match will be removed before parsing. Defaults to `/^\s*\/\*\*\s?/`.

##### `config.endPattern`

Type: `RegExp`

The end of docblock. The match will be removed before parsing. Defaults to `/\*\/\s*$/`.

##### `config.linePattern`

Type: `RegExp`

Start of a line in a docblock. The match will be removed while parsing aline. Defaults to `/^\s*\* ?/`.

##### `config.text`

Type: `function`

A consumer for all free text inside the doc block. I.e. text not associated with
a specific tag.

##### `config.default`

Type: `function`

The fallback consumer used for tags not listed in `config.tags`.

##### `config.tags`

Type: `object`

A `tag name -> consumer` mapping that allows to use different strategies for
different tags.

##### Returns `{text: (Array|string), tags {tagname: (Array|?), ...}}`

###### `text`

Is an array if the doc block contains multiple sections of free text, else a
single string.

###### `tags`

Is an object of `tagname -> value` mappings. The type of the value depends on
the consumer being used for the tag, but it will definitely be an array if the
tag appeared multiple times in the doc block (e.g. `@param`).

## Examples

### Custom Tags
```js
var docblockParser = require('./');
var docstring = [
  '/**',
  ' * Some free text',
  ' *',
  ' * @public',
  ' * @extends',
  ' * SuperLongClassName',
  ' * @multiline-example',
  ' * E.g. for example code',
  ' *',
  ' *     var foo = bar;',
  ' *',
  ' * With description.',
  ' *',
  ' * @param {string} foo',
  ' * @param {number} bar',
  ' * @returns {boolean} Some desciption',
  ' */',
].join('\n');

// config.text and config.default is provided through the default config
var result = docblockParser({
  tags: {
    public: docblockParser.booleanTag,
    extends: docblockParser.singleParameterTag,
    'multiline-example': docblockParser.multilineTilTag,
    param: docblockParser.multilineTilTag,
    returns: docblockParser.multilineTilTag,
  }
}).parse(docstring);
```

returns

```js
{
  text: 'Some free text',
  tags: {
    public: true,
    extends: 'SuperLongClassName',
    'multiline-example': 'E.g. for example code\n\n    var foo = bar;\n\nWith description.',
    param: [ '{string} foo', '{number} bar' ],
    returns: '{boolean} Some desciption'
  }
}
```
Note that there is no line break after "Some free text" and "With description".
If you are using the built-in default consumer (`consumeTil`)(which all of the
built-in consumer do), leading and trailing lines will be removed form the
value.

In this example we specified our own tag consumers. We could have also used the
default ones and just called `docblockParser.parse(docstring)`.

### Custom format
```js
var docblockParser = require('./');
var docstring = '{##\nSome free text\n@memberOf test\n##}';
var result = docblockParser({
	docBlockPattern: /\{##([^#]*)##\}/ig,
	startPattern: /^\s*\{##\s?/,
	endPattern: /##\}\s*$/
}).parse(docstring);
```

returns

```js
{
  text: 'Some free text',
  tags: {
    memberOf: 'test'
  }
}
```

### Built-in consumers

The parser comes with consumers for the most common use cases:

- `multilineTilTag`
 - Consumes as many lines until it encounters a line starting with the
   @tagname` pattern.
 - Returns: The collected lines. This is usually the safest to use, since it
   may not always be possible to format the values of tags in a specific way.

- `multilineTilEmptyLineOrTag`
  - Consumes as many lines until it encounters an empty line or a tag.
  - Returns: The collected lines.

- `booleanTag`
  - Consumes just the current line.
  - Returns: True. The mere fact that the function is called means that the tag
    exists.

- `singleParameterTag`
  - Consumes lines until it finds a non-empty line.
  - Returns: The collected line. That is the value of the tag.

- `multiParameterTag(delimiter)`
  - Based on `multilineTilEmptyLineOrTag`
  - Returns: Returns an array of values. The values come from
    `multilineTilEmptyLineOrTag` split by `delimiter`.

## License

ISC
