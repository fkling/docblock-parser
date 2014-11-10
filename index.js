"use strict";

var Docblock = require('./Docblock');

var assign = require('lodash.assign');
var consumers = require('./consumers');
var defaultConfig = require('./defaultConfig');

var DOCBLOCK_PATTERN = /^\s*\/\*\*[^]*\*\/\s*$/;
var TAG_PATTERN = /^\s*@([^\s]+)\s?/;

function docblockParser(config={}) {
  if (!config.text) {
    config.text = defaultConfig.text;
  }
  if (!config.default) {
    config.default = defaultConfig.default;
  }

  function parse(docstring) {
    if (!docstring || !DOCBLOCK_PATTERN.test(docstring)) {
      throw new TypeError('Argument is not a valid docstring (/** ... */).');
    }

    var text = [];
    var tags = {};
    var tag;

    var docblock = new Docblock(docstring.split('\n'));
    while (!docblock.isExhausted()) {
      consumers.emptyLines(docblock);
      var line = docblock.peek();
      if (!line) { continue;}
      var match = line.match(TAG_PATTERN);
      if (match) {
        docblock.replace(line.replace(TAG_PATTERN, ''));
        tag = match[1];
        var consumer = config.tags[tag] || config.default;
        var tagValue = consumer(docblock);
        if (!tags.hasOwnProperty(tag)) {
          tags[tag] = [];
        }
        tags[tag].push(tagValue);
      }
      else {
        text.push(config.text(docblock));
      }
    }

    // simplify entries with single values
    for (tag in tags) {
      if (tags.hasOwnProperty(tag) && tags[tag].length === 1) {
        tags[tag] = tags[tag][0];
      }
    }
    // simplify text
    if (text.length === 1) {
      text = text[0];
    }
    else if (text.length === 0) {
      text = '';
    }

    return {text: text, tags: tags};
  }

  return {parse: parse};
}

docblockParser.parse = docblockParser(defaultConfig).parse;
docblockParser.consumeTil = require('./consumeTil');
assign(docblockParser, consumers);

module.exports = docblockParser;