jest.autoMockOff();

function docstring(lines) {
  lines = lines.map(function(line) {
    return ' *' + line;
  });
  lines.unshift('/**');
  lines.push(' */');
  return lines.join('\n');
}

describe('docblock-parser', function() {
  var docblockParser;

  beforeEach(function() {
    docblockParser = require('../');
  });

  describe('API', function() {

    it('exposes a parse method', function() {
      expect(typeof docblockParser.parse).toBe('function');
    });

    it('accepts a docblock', function() {
      expect(function() {
        docblockParser.parse('/** foo */');
      }).not.toThrow();
    });

    it('allows to configure a custom docblock format', function() {
      expect(function() {
        var config = {
          docBlockPattern: /\{##([^#]*)##\}/ig,
          startPattern: /^\s*\{##\s?/,
          endPattern: /##\}\s*$/
        };
        docblockParser(config).parse('{## foo ##}');
      }).not.toThrow();
    });

    it('throws if the argument is not a docblock', function() {
      expect(function() {
        docblockParser.parse('foo');
      }).toThrow();
    });

  });

  describe('Parsing', function() {
    describe('free text', function() {
      it('extracts text from a single line', function() {
        expect(docblockParser().parse('/** foo bar */').text).toEqual('foo bar');
      });

      it('extracts text from multiple lines', function() {
        var text = 'Some multiline\ntext with empty\n\nlines.';
        var ds = docstring(text.split('\n'));
        expect(docblockParser.parse(ds).text).toEqual(text);
      });

      it('extracts text from a single line with a custom format', function() {
        var config = {
          docBlockPattern: /\{##([^#]*)##\}/ig,
          startPattern: /^\s*\{##\s?/,
          endPattern: /##\}\s*$/
        };
        expect(docblockParser(config).parse('{## foo bar ##}').text).toEqual('foo bar');
      });

      it('extracts text from multiple lines with a custom format', function() {
        var config = {
          docBlockPattern: /\{##([^#]*)##\}/ig,
          startPattern: /^\s*\{##\s?/,
          endPattern: /##\}\s*$/
        };
        var text = 'Some multiline\ntext with empty\n\nlines.';
        var doc = '{##\n' + text + '\n##}';
        expect(docblockParser(config).parse(doc).text).toEqual(text);
      });
    });

    describe('tags', function() {
      it('extracts boolean tags', function() {
        var ds = docstring(['@foo', '@bar']);
        var tags = docblockParser({
          tags: {
            foo: docblockParser.booleanTag,
            bar: docblockParser.booleanTag
          }
        }).parse(ds).tags;
        expect(tags).toEqual({foo: true, bar: true});
      });

      it('extracts single parameter tags', function() {
        var ds = docstring([
          '@foo bar',
          'Some text in between',
          '@bar',
          'baz',
          '@tricky',
          '@value'
        ]);

        var result = docblockParser({
          tags: {
            foo: docblockParser.singleParameterTag,
            bar: docblockParser.singleParameterTag,
            tricky: docblockParser.singleParameterTag
          }
        }).parse(ds);

        expect(result)
          .toEqual({
            text: 'Some text in between',
            tags: {foo: 'bar', bar: 'baz', tricky: '@value'}
          });
      });

      it('extracts multi parameter tags', function() {
        var ds = docstring([
          '@foo x y z',
          '@bar a,',
          'b,c,',
          'd',
        ]);

        var result = docblockParser({
          tags: {
            foo: docblockParser.multiParameterTag(' '),
            bar: docblockParser.multiParameterTag(/,\s*/)
          }
        }).parse(ds);

        expect(result)
          .toEqual({
            text: '', tags: {foo: ['x', 'y', 'z'], bar: ['a', 'b', 'c', 'd']}
          });
      });

      it('extracts multline tags', function() {
        var ds = docstring([
          '@foo',
          'some text',
          'with',
          '',
          'empty line',
          '@bar some text',
          'with',
          '',
          'empty line'
        ]);

        var result = docblockParser({
          tags: {
            foo: docblockParser.multilineTilEmptyLineOrTag,
            bar: docblockParser.multilineTilTag,
          }
        }).parse(ds);

        expect(result)
          .toEqual({
            text: 'empty line',
            tags: {foo: 'some text\nwith', bar: 'some text\nwith\n\nempty line'}
          });

      });

      it('groups some tags', function() {
        var ds = docstring([
          '@foo bar',
          '@foo baz'
        ]);

        var result = docblockParser({
          tags: {
            foo: docblockParser.singleParameterTag,
            bar: docblockParser.singleParameterTag,
          }
        }).parse(ds);

        expect(result)
          .toEqual({
            text: '',
            tags: {foo: ['bar', 'baz']}
          });
      });
    });
  });

});
