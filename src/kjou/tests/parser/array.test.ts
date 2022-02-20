import { deepStrictEqual } from 'assert';
import { KjouParser } from '~kjou';

deepStrictEqual(new KjouParser('[]').parseArray(), []);
deepStrictEqual(new KjouParser('[[]]').parseArray(), [[]]);
deepStrictEqual(new KjouParser('[[[null],true,]0,]').parseArray(), [
  [[null], true],
  0,
]);
deepStrictEqual(
  new KjouParser('[ [ [ null ] , true , ] 0 , ]  ').parseArray(),
  [[[null], true], 0],
);
