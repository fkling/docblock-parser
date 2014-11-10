"use strict";

var START_PATTERN = /^\s*\/\*\*\s?/;
var END_PATTERN = /\*\/\s*$/;

/**
 * This class is used to process a docblock line by line.
 */
class Docblock {
  constructor(lines) {
    this._current = 0;
    this._lines = lines;
    this._lines[0] = lines[0].replace(START_PATTERN, '');
    this._lines[lines.length - 1] =
      lines[lines.length - 1].replace(END_PATTERN, '');
  }

  /**
   * Returns the current line.
   *
   * @return {string}
   */
  peek() {
    if (this._current < this._lines.length) {
      return this._lines[this._current].replace(/^\s*\* ?/, '');
    }
    return null;
  }

  /**
   * Returns the current line and advances to the next line.
   *
   * @return {string}
   */
  pop() {
    var line = this.peek();
    if (line != null) {
      this._current += 1;
      return line;
    }
    return null;
  }

  /**
   * Allows to replace the current line with this value. This shouldn't be
   * called by consumers.
   */
  replace(line) {
    this._lines[this._current] = line;
  }

  /**
   * Returns true if the all of docblock was processed.
   *
   * @return {boolean}
   */
  isExhausted() {
    return this._current >= this._lines.length;
  }
}

module.exports = Docblock;
