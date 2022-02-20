import { deepStrictEqual, strictEqual } from 'assert';
import { KjouNode, KjouParser } from '~kjou';

strictEqual(new KjouParser('false').parseEnum(), false);
strictEqual(new KjouParser('true').parseEnum(), true);
strictEqual(new KjouParser('null').parseEnum(), null);
deepStrictEqual(
  new KjouParser('name').parseEnum(),
  new KjouNode({ name: 'name' }),
);
