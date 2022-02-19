import { deepStrictEqual } from 'assert';
import { KjouParser } from '../../parser';

deepStrictEqual(new KjouParser('{}').parseObject(), {});

// Properties:
deepStrictEqual(new KjouParser('{foo:bar}').parseObject(), { foo: 'bar' });
deepStrictEqual(new KjouParser('{bar:null,qux:42}').parseObject(), {
  bar: null,
  qux: 42,
});
deepStrictEqual(new KjouParser('{disabled}').parseObject(), {
  disabled: undefined,
});
deepStrictEqual(new KjouParser('{a,b c}').parseObject(), {
  a: undefined,
  b: undefined,
  c: undefined,
});
deepStrictEqual(new KjouParser('{ a : b c d : "yes" }').parseObject(), {
  a: 'b',
  c: undefined,
  d: 'yes',
});

// Literal keys:
deepStrictEqual(new KjouParser('{123,0 -5:-5}').parseObject(), {
  '-5': -5,
  0: undefined,
  123: undefined,
});
deepStrictEqual(new KjouParser('{ "foo bar": "baz", \'qux\' }').parseObject(), {
  'foo bar': 'baz',
  qux: undefined,
});
