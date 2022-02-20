import { GLOBAL_CONSTRUCTORS } from '../constants';

export type Deconstructor = (value: unknown) => unknown[];

export type DeconstructorCollection = {
  AggregateError: DeconstructorOf<AggregateErrorConstructor>;
  Array: DeconstructorOf<ArrayConstructor>;
  ArrayBuffer: DeconstructorOf<ArrayBufferConstructor>;
  BigInt64Array: DeconstructorOf<BigInt64ArrayConstructor>;
  BigUint64Array: DeconstructorOf<BigUint64ArrayConstructor>;
  Boolean: DeconstructorOf<BooleanConstructor>;
  DataView: DeconstructorOf<DataViewConstructor>;
  Date: DeconstructorOf<DateConstructor>;
  Error: DeconstructorOf<ErrorConstructor>;
  EvalError: DeconstructorOf<EvalErrorConstructor>;
  FinalizationRegistry: DeconstructorOf<FinalizationRegistryConstructor>;
  Float32Array: DeconstructorOf<Float32ArrayConstructor>;
  Float64Array: DeconstructorOf<Float64ArrayConstructor>;
  Function: DeconstructorOf<FunctionConstructor>;
  Int16Array: DeconstructorOf<Int16ArrayConstructor>;
  Int32Array: DeconstructorOf<Int32ArrayConstructor>;
  Int8Array: DeconstructorOf<Int8ArrayConstructor>;
  Map: DeconstructorOf<MapConstructor>;
  Number: DeconstructorOf<NumberConstructor>;
  Object: DeconstructorOf<ObjectConstructor>;
  Promise: DeconstructorOf<PromiseConstructor>;
  RangeError: DeconstructorOf<RangeErrorConstructor>;
  ReferenceError: DeconstructorOf<ReferenceErrorConstructor>;
  RegExp: DeconstructorOf<RegExpConstructor>;
  Set: DeconstructorOf<SetConstructor>;
  SharedArrayBuffer: DeconstructorOf<SharedArrayBufferConstructor>;
  String: DeconstructorOf<StringConstructor>;
  SyntaxError: DeconstructorOf<SyntaxErrorConstructor>;
  TypeError: DeconstructorOf<TypeErrorConstructor>;
  URIError: DeconstructorOf<URIErrorConstructor>;
  Uint16Array: DeconstructorOf<Uint16ArrayConstructor>;
  Uint32Array: DeconstructorOf<Uint32ArrayConstructor>;
  Uint8Array: DeconstructorOf<Uint8ArrayConstructor>;
  Uint8ClampedArray: DeconstructorOf<Uint8ClampedArrayConstructor>;
  WeakMap: DeconstructorOf<WeakMapConstructor>;
  WeakRef: DeconstructorOf<WeakRefConstructor>;
  WeakSet: DeconstructorOf<WeakSetConstructor>;
};

export type DeconstructorOf<TConstructor extends GlobalConstructor> = (
  value: InstanceOf<TConstructor>,
) => GlobalConstructorParameters<TConstructor>;

export type GlobalConstructor =
  typeof GLOBAL_CONSTRUCTORS[GlobalConstructorName];

export type GlobalConstructorName = keyof typeof GLOBAL_CONSTRUCTORS;

export type GlobalConstructorParameters<
  TConstructor extends GlobalConstructor,
> = TConstructor extends ArrayBufferConstructor | DataViewConstructor
  ? number[]
  : TConstructor extends BigInt64ArrayConstructor | BigUint64ArrayConstructor
  ? [bigint[]]
  : TConstructor extends
      | Float32ArrayConstructor
      | Float64ArrayConstructor
      | Int16ArrayConstructor
      | Int32ArrayConstructor
      | Int8ArrayConstructor
      | Uint16ArrayConstructor
      | Uint32ArrayConstructor
      | Uint8ArrayConstructor
      | Uint8ClampedArrayConstructor
  ? [number[]]
  : ConstructorParameters<TConstructor>;

export type InstanceOf<C extends GlobalConstructor> =
  C extends AggregateErrorConstructor
    ? AggregateError
    : C extends ArrayConstructor
    ? unknown[]
    : C extends ArrayBufferConstructor
    ? ArrayBuffer
    : C extends BigInt64ArrayConstructor
    ? BigInt64Array
    : C extends BigUint64ArrayConstructor
    ? BigUint64Array
    : C extends BooleanConstructor
    ? boolean
    : C extends DataViewConstructor
    ? DataView
    : C extends DateConstructor
    ? Date
    : C extends ErrorConstructor
    ? Error
    : C extends EvalErrorConstructor
    ? EvalError
    : C extends FinalizationRegistryConstructor
    ? FinalizationRegistry<unknown>
    : C extends Float32ArrayConstructor
    ? Float32Array
    : C extends Float64ArrayConstructor
    ? Float64Array
    : C extends FunctionConstructor
    ? Function
    : C extends Int16ArrayConstructor
    ? Int16Array
    : C extends Int32ArrayConstructor
    ? Int32Array
    : C extends Int8ArrayConstructor
    ? Int8Array
    : C extends MapConstructor
    ? Map<unknown, unknown>
    : C extends NumberConstructor
    ? number
    : C extends ObjectConstructor
    ? object
    : C extends PromiseConstructor
    ? Promise<unknown>
    : C extends RangeErrorConstructor
    ? RangeError
    : C extends ReferenceErrorConstructor
    ? ReferenceError
    : C extends RegExpConstructor
    ? RegExp
    : C extends SetConstructor
    ? Set<unknown>
    : C extends SharedArrayBufferConstructor
    ? SharedArrayBuffer
    : C extends StringConstructor
    ? string
    : C extends SyntaxErrorConstructor
    ? SyntaxError
    : C extends TypeErrorConstructor
    ? TypeError
    : C extends URIErrorConstructor
    ? URIError
    : C extends Uint16ArrayConstructor
    ? Uint16Array
    : C extends Uint32ArrayConstructor
    ? Uint32Array
    : C extends Uint8ArrayConstructor
    ? Uint8Array
    : C extends Uint8ClampedArrayConstructor
    ? Uint8ClampedArray
    : C extends WeakMapConstructor
    ? WeakMap<object, unknown>
    : C extends WeakRefConstructor
    ? WeakRef<object>
    : C extends WeakSetConstructor
    ? WeakSet<object>
    : never;
