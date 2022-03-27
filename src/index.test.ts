import { deepStrictEqual } from 'assert';
import { JSONPlus } from '.';

const JSON = new JSONPlus();

const arrayBuffer = new ArrayBuffer(2);
const dataView = new DataView(arrayBuffer);
dataView.setInt16(0, 643, true);

const data = {
  // AggregateError: new AggregateError([
  //   new TypeError("Type 'string' is not assignable to 'string{1,255}'."),
  //   new RangeError(
  //     "Range '{0,Infinity}' is out of bounds for range '{1,255}'.",
  //   ),
  // ]),
  Array: ['foo', 42, [null, []], undefined, ['_Array', 1, 2]],
  ArrayBuffer: arrayBuffer,
  BigInt64Array: new BigInt64Array([162n, 39n]),
  BigUint64Array: new BigUint64Array([162n, 39n]),
  Boolean: new Boolean(true),
  DataView: dataView,
  Date: new Date('2022-03-16T08:53:01.402Z'),
  // Error: new Error('Something went wrong.'),
  // EvalError: new EvalError("Cannot find name 'global'."),
  Float32Array: new Float32Array([162.17, 39.998]),
  Float64Array: new Float64Array([162.17, 39.998]),
  // Function: (a: number, b: number) => a + b,
  Infinity,
  Int16Array: new Int16Array([162, 39]),
  Int32Array: new Int32Array([162, 39]),
  Int8Array: new Int8Array([162, 39]),
  Map: new Map<string, unknown>([
    ['foo', 'bar'],
    ['qux', new Map([[1, 2]])],
  ]),
  NaN,
  Number: new Number(-123.456),
  Object: { foo: 'bar', qux: { baz: null } },
  // RangeError: new RangeError('Age must be between 0-99.'),
  // ReferenceError: new ReferenceError('Variable "user" is not defined.'),
  RegExp: /^foo$/gi,
  Set: new Set(['foo', 42, null]),
  String: new String('This is a "nice" string.'),
  // SyntaxError: new SyntaxError('Unexpected character "{" at index 27.'),
  // TypeError: new TypeError('Expected value to be a String.'),
  // URIError: new URIError('The URI to be encoded contains invalid character'),
  Uint16Array: new Uint16Array([162, 39]),
  Uint32Array: new Uint32Array([162, 39]),
  Uint8Array: new Uint8Array([162, 39]),
  Uint8ClampedArray: new Uint8ClampedArray([162, 39]),
  bigint: 37n,
  boolean: false,
  negativeZero: -0,
  null: null,
  number: 0,
  string: 'Hello world!',
  // symbol: Symbol('Hello world!'),
  undefined,
};

deepStrictEqual(data, JSON.parse(JSON.stringify(data)));

deepStrictEqual(
  JSON.stringify({ set: new Set([0, 1, 2]) }, (key, value) => {
    return typeof value === 'number' ? value * 2 : value;
  }),
  '{"set":["_Set",[0,2,4]]}',
);

deepStrictEqual(
  JSON.parse('{"set":["_Set",[0,2,4]]}', (key, value) => {
    return typeof value === 'number' ? value / 2 : value;
  }),
  { set: new Set([0, 1, 2]) },
);
