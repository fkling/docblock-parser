"use strict";
var identity = function(x) {
  return x;
};
var trimTag = function(x) {
  return x.replace(/^\s*@[^\s]+ ?/, "");
};

/**
 * This function takes a predicate and a filter and returns a consumer.
 *
 * The consumer accepts a Docblock object and consumes lines as long as
 * `predicate` does not return `true` for a line. The consumed lines are passed
 * through `filter` which can be used to further process each line.
 *
 * @param {function} predicate A function that should return `true` if
 *   consumption should stop.
 * @param {function} filter Process line before consumed. Can return `null` to
 *   ignore the line.
 * @return {string} The concatenation of collected lines.
 */
function consumeTil(predicate, filter) {
  filter = filter || identity;
  return function(docblock) {
    /*jshint validthis:true */
    var lines = [];
    var i = 0;
    while (docblock.peek() != null && !predicate(docblock.peek(), i)) {
      i += 1;
      var line = filter(docblock.pop());
      if (line != null) {
        lines.push(line);
      }
    }
    // we remove empty first and last lines
    if (lines.length && !lines[0].trim()) {
      lines = lines.slice(1);
    }
    if (lines.length && !lines[lines.length - 1].trim()) {
      lines = lines.slice(0, -1);
    }

    return lines.join("\n");
  };
}

module.exports = consumeTil;
