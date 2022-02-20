import { DeconstructorCollection } from '../types';

const createUnsupportedDeconstructor = (constructorName: string) => {
  const throwDeconstructorNotSupportedError = () => {
    throw new Error(`Deconstructing a ${constructorName} is not supported.`);
  };
  return throwDeconstructorNotSupportedError;
};

export const DECONSTRUCTORS: DeconstructorCollection = {
  /**
   * AggregateError was introduced in Node v15.
   */
  ...(typeof AggregateError === 'undefined'
    ? {}
    : { AggregateError: (value) => [value.errors] }),
  AggregateError: (value) => [value.errors],
  Array: (value) => value,
  ArrayBuffer: (value) => [...new Uint8Array(value)],
  BigInt64Array: (value) => [[...value]],
  BigUint64Array: (value) => [[...value]],
  Boolean: (value) => [value.valueOf()],
  DataView: (value) => [...new Uint8Array(value.buffer)],
  Date: (value) => [value.valueOf()],
  Error: (value) => [value.message],
  EvalError: (value) => [value.message],
  FinalizationRegistry: createUnsupportedDeconstructor('FinalizationRegistry'),
  Float32Array: (value) => [[...value]],
  Float64Array: (value) => [[...value]],
  Function: (value) => [value.toString()],
  Int16Array: (value) => [[...value]],
  Int32Array: (value) => [[...value]],
  Int8Array: (value) => [[...value]],
  Map: (value) => [[...value]],
  Number: (value) => [value.valueOf()],
  Object: (value) => [value],
  Promise: createUnsupportedDeconstructor('Promise'),
  RangeError: (value) => [value.message],
  ReferenceError: (value) => [value.message],
  RegExp: (v) => [v.source, ...((v.flags ? [v.flags] : []) as [string?])],
  Set: (value) => [[...value]],
  SharedArrayBuffer: createUnsupportedDeconstructor('SharedArrayBuffer'),
  String: (value) => [value.valueOf()],
  SyntaxError: (value) => [value.message],
  TypeError: (value) => [value.message],
  URIError: (value) => [value.message],
  Uint16Array: (value) => [[...value]],
  Uint32Array: (value) => [[...value]],
  Uint8Array: (value) => [[...value]],
  Uint8ClampedArray: (value) => [[...value]],
  WeakMap: createUnsupportedDeconstructor('WeakMap'),
  WeakRef: createUnsupportedDeconstructor('WeakRef'),
  WeakSet: createUnsupportedDeconstructor('WeakSet'),
};
