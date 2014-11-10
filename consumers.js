var consumeTil = require('./consumeTil');
var predicates = require('./predicates');

var rtrim = x => x.replace(/\s*$/, '');

var emptyLines = consumeTil(x => x.trim() !== '');
var multilineTilTag = consumeTil(predicates.isTagLine, rtrim);
var multilineTilEmptyLineOrTag = consumeTil(
  (x, i) => i > 0 && predicates.isEmptyLine(x) || predicates.isTagLine(x),
  rtrim
);

var booleanTag = function(docblock) {
  docblock.pop();
  return true;
};

var singleParameterTag = function(docblock) {
  var hasSeenNonEmptyLine = false;
  var value = consumeTil(function(line) {
    var prev = hasSeenNonEmptyLine;
    hasSeenNonEmptyLine = line.trim() !== '';
    return prev;
  }, rtrim)(docblock);
  return value;
};

var multiParameterTag = function(delimiter) {
  return function(docblock) {
    return multilineTilEmptyLineOrTag(docblock)
      .replace('\n', ' ')
      .split(delimiter);
  };
};

module.exports = {
  emptyLines,
  multilineTilTag,
  multilineTilEmptyLineOrTag,
  booleanTag,
  singleParameterTag,
  multiParameterTag
};
