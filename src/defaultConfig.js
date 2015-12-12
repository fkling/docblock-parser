"use strict";

var {
  multilineTilTag,
  multilineTilEmptyLineOrTag,
  booleanTag,
  singleParameterTag
} = require('./consumers');

module.exports = {
  text: multilineTilTag,
  default: multilineTilTag,
  tags: {
    augments: singleParameterTag,
    author: multilineTilEmptyLineOrTag,
    borrows: multilineTilEmptyLineOrTag,
    class: multilineTilTag,
    constant: booleanTag,
    constructor: booleanTag,
    constructs: booleanTag,
    default: singleParameterTag,
    deprecated: multilineTilEmptyLineOrTag,
    desciption: multilineTilTag,
    event: booleanTag,
    example: multilineTilTag,
    extends: singleParameterTag,
    field: booleanTag,
    fileOverview: multilineTilTag,
    function: booleanTag,
    ignore: booleanTag,
    inner: booleanTag,
    lends: singleParameterTag,
    memberOf: singleParameterTag,
    name: booleanTag,
    namespace: booleanTag,
    param: multilineTilEmptyLineOrTag,
    private: booleanTag,
    property: multilineTilEmptyLineOrTag,
    public: booleanTag,
    requires: multilineTilEmptyLineOrTag,
    returns: multilineTilEmptyLineOrTag,
    see: singleParameterTag,
    since: singleParameterTag,
    static: booleanTag,
    throws: multilineTilEmptyLineOrTag,
    type: singleParameterTag,
    version: multilineTilEmptyLineOrTag
  }
};
