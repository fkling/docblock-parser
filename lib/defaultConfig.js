"use strict";

var var$0 = require("./consumers"), multilineTilTag = var$0.multilineTilTag, multilineTilEmptyLineOrTag = var$0.multilineTilEmptyLineOrTag, booleanTag = var$0.booleanTag, singleParameterTag = var$0.singleParameterTag;

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
