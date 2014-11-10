"use strict";
var TAG_PATTERN = /^\s*@[^\s]+/;

module.exports = {
  isEmptyLine: line => /^\s*$/.test(line),
  isTagLine: line => TAG_PATTERN.test(line),
};
