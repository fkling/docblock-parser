"use strict";

var Docblock = require("./Docblock");

var assign = require("lodash.assign");
var consumers = require("./consumers");
var defaultConfig = require("./defaultConfig");

function docblockParser() {
  var config = (arguments[0] !== void 0 ? arguments[0] : {});
  if (!config.text) {
    config.text = defaultConfig.text;
  }
  if (!config.default) {
    config.default = defaultConfig.default;
  }
  if (!config.docBlockPattern) {
    config.docBlockPattern = /^\/\*\*|^\s*\* ?/m;
  }
  if (!config.tagPattern) {
    config.tagPattern = /^\s*@([^\s]+)\s?/;
  }
  if (!config.startPattern) {
    config.startPattern = /^\s*\/\*\*\s?/;
  }
  if (!config.endPattern) {
    config.endPattern = /\*\/\s*$/;
  }
  if (!config.linePattern) {
    config.linePattern = /^\s*\* ?/;
  }

  function parse(docstring) {
    if (!docstring || !config.docBlockPattern.test(docstring)) {
      throw new TypeError(
        "Argument does not appear to be a valid docstring. A docstring " +
        "usually starts with /**, ends with */ and every line in between " +
        "starts with a single *. This is what I got instead:\n\n" +
        docstring
      );
    }

    var text = [];
    var tags = {};
    var tag;

    var docblock = new Docblock(docstring.split("\n"), config.startPattern, config.endPattern, config.linePattern);
    while (!docblock.isExhausted()) {
      consumers.emptyLines(docblock);
      var line = docblock.peek();
      if (!line) { continue;}
      var match = line.match(config.tagPattern);
      if (match) {
        docblock.replace(line.replace(config.tagPattern, ""));
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
      text = "";
    }

    return {text: text, tags: tags};
  }

  return {parse: parse};
}

docblockParser.parse = docblockParser(defaultConfig).parse;
docblockParser.consumeTil = require("./consumeTil");
docblockParser.defaultConfig = defaultConfig;
assign(docblockParser, consumers);

module.exports = docblockParser;
