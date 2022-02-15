import { strictEqual, throws } from 'assert';
import { KjouParser } from '../../parser';

// Integers:
strictEqual(new KjouParser('0').parseNumber(), 0);
throws(() => {
  new KjouParser('01').parseNumber();
});
strictEqual(new KjouParser('123').parseNumber(), 123);

// Decimals:
strictEqual(new KjouParser('0.987').parseNumber(), 0.987);
strictEqual(new KjouParser('123.456').parseNumber(), 123.456);

// Signs:
strictEqual(new KjouParser('-0').parseNumber(), -0);
strictEqual(new KjouParser('+456').parseNumber(), +456);

// Exponents:
strictEqual(new KjouParser('3e3').parseNumber(), 3e3);
strictEqual(new KjouParser('0.123e3').parseNumber(), 0.123e3);
throws(() => {
  new KjouParser('1e1.1').parseNumber();
});
strictEqual(new KjouParser('-5.9e5').parseNumber(), -5.9e5);
