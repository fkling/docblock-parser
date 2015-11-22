"use strict";

var $__Object$defineProperties = Object.defineProperties;

var Docblock = function() {
  "use strict";

  function Docblock(lines, startPattern, endPattern, linePattern) {
    this._startPattern = startPattern || /^\s*\/\*\*\s?/;
    this._endPattern = endPattern || /\*\/\s*$/;
    this._linePattern = linePattern || /^\s*\* ?/;
    this._current = 0;
    this._lines = lines;
    this._lines[0] = lines[0].replace(this._startPattern, "");
    this._lines[lines.length - 1] =
      lines[lines.length - 1].replace(this._endPattern, "");
  }

  $__Object$defineProperties(Docblock.prototype, {
    peek: {
      value: function() {
        if (this._current < this._lines.length) {
          return this._lines[this._current].replace(this._linePattern, "");
        }
        return null;
      },

      enumerable: false,
      writable: true
    },

    pop: {
      value: function() {
        var line = this.peek();
        if (line != null) {
          this._current += 1;
          return line;
        }
        return null;
      },

      enumerable: false,
      writable: true
    },

    replace: {
      value: function(line) {
        this._lines[this._current] = line;
      },

      enumerable: false,
      writable: true
    },

    isExhausted: {
      value: function() {
        return this._current >= this._lines.length;
      },

      enumerable: false,
      writable: true
    }
  });

  return Docblock;
}();

module.exports = Docblock;
