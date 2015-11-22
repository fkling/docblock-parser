"use strict";
var TAG_PATTERN = /^\s*@[^\s]+/;

module.exports = {
  isEmptyLine: function(line) {
    return /^\s*$/.test(line);
  },
  isTagLine: function(line) {
    return TAG_PATTERN.test(line);
  },
};
