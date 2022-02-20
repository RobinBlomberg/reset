import { strictEqual, throws } from 'assert';
import { KjouParser } from '~kjou';

// Empty strings:
strictEqual(new KjouParser('""').parseString(), '');
strictEqual(new KjouParser("''").parseString(), '');

// Escaped characters:
strictEqual(
  new KjouParser('"\\\'\\"\\/\\b\\f\\n\\r\\t"').parseString(),
  '\'"/\b\f\n\r\t',
);
strictEqual(new KjouParser('"\\""').parseString(), '"');
strictEqual(new KjouParser("'\\''").parseString(), "'");
throws(() => {
  new KjouParser('\\a').parseString();
});

// Escaped Unicode:
strictEqual(new KjouParser('"\\uD83D\\uDC4B"').parseString(), '👋');
throws(() => {
  new KjouParser('"\\uD83G"').parseString();
});
