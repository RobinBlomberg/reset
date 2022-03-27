export type JSONPlusReplacer = (value?: any) => unknown[];

export type JSONPlusReviver = (args: any[]) => unknown;

export class JSONPlus {
  constructors: Record<string, new (...args: any) => unknown> = {
    /**
     * AggregateError was introduced in Node v15.
     */
    ...(typeof AggregateError === 'undefined' ? {} : { AggregateError }),
    Array,
    ArrayBuffer,
    BigInt64Array,
    BigUint64Array,
    Boolean,
    DataView,
    Date,
    Error,
    EvalError,
    Float32Array,
    Float64Array,
    Function,
    Int16Array,
    Int32Array,
    Int8Array,
    Map,
    Number,
    Object,
    RangeError,
    ReferenceError,
    RegExp,
    Set,
    String,
    SyntaxError,
    TypeError,
    URIError,
    Uint16Array,
    Uint32Array,
    Uint8Array,
    Uint8ClampedArray,
  };

  instanceReplacers = new Map<Function, JSONPlusReplacer>([
    /**
     * AggregateError was introduced in Node v15.
     */
    ...(typeof AggregateError === 'undefined'
      ? []
      : ([[AggregateError, (v: AggregateError) => [v.errors]]] as const)),
    [Array, (v: unknown[]) => v],
    [ArrayBuffer, (v: ArrayBuffer) => [...new Uint8Array(v)]],
    [BigInt64Array, (v: BigInt64Array) => [...v]],
    [BigUint64Array, (v: BigUint64Array) => [...v]],
    [Boolean, (v: Boolean) => [v.valueOf()]],
    [DataView, (v: DataView) => [...new Uint8Array(v.buffer)]],
    [Date, (v: Date) => [v.valueOf()]],
    [Error, (v: Error) => [v.message]],
    [EvalError, (v: EvalError) => [v.message]],
    [Float32Array, (v: Float32Array) => [...v]],
    [Float64Array, (v: Float64Array) => [...v]],
    [Function, (v: Function) => [v.toString()]],
    [Int16Array, (v: Int16Array) => [...v]],
    [Int32Array, (v: Int32Array) => [...v]],
    [Int8Array, (v: Int8Array) => [...v]],
    [Map, (v: Map<unknown, unknown>) => [[...v]]],
    [Number, (v: Number) => [v.valueOf()]],
    [RangeError, (v: RangeError) => [v.message]],
    [ReferenceError, (v: ReferenceError) => [v.message]],
    [RegExp, (v: RegExp) => [v.source, ...(v.flags ? [v.flags] : [])]],
    [Set, (v: Set<unknown>) => [[...v]]],
    [String, (v: string) => [v.valueOf()]],
    [SyntaxError, (v: SyntaxError) => [v.message]],
    [TypeError, (v: TypeError) => [v.message]],
    [URIError, (v: URIError) => [v.message]],
    [Uint16Array, (v: Uint16Array) => [...v]],
    [Uint32Array, (v: Uint32Array) => [...v]],
    [Uint8Array, (v: Uint8Array) => [...v]],
    [Uint8ClampedArray, (v: Uint8ClampedArray) => [...v]],
  ]);

  negativeZeroReplacer?: JSONPlusReplacer = () => ['_-0'];

  revivers: Record<string, JSONPlusReviver> = {
    '-0': () => -0,
    '-Infinity': () => -Infinity,
    ArrayBuffer: (v: number[]) => Uint8Array.from(v).buffer,
    BigInt64Array: (v: bigint[]) => BigInt64Array.from(v),
    BigUint64Array: (v: bigint[]) => BigUint64Array.from(v),
    DataView: (v: number[]) => new DataView(Uint8Array.from(v).buffer),
    Float32Array: (v: number[]) => Float32Array.from(v),
    Float64Array: (v: number[]) => Float64Array.from(v),
    Infinity: () => Infinity,
    Int16Array: (v: number[]) => Int16Array.from(v),
    Int32Array: (v: number[]) => Int32Array.from(v),
    Int8Array: (v: number[]) => Int8Array.from(v),
    NaN: () => NaN,
    Uint16Array: (v: number[]) => Uint16Array.from(v),
    Uint32Array: (v: number[]) => Uint32Array.from(v),
    Uint8Array: (v: number[]) => Uint8Array.from(v),
    Uint8ClampedArray: (v: number[]) => Uint8ClampedArray.from(v),
    bigint: (v: (string | number | bigint | boolean)[]) => BigInt(v[0]!),
    symbol: (v: (string | number | undefined)[]) => Symbol(v[0]),
    undefined: () => undefined,
  };

  typeReplacers: Record<string, JSONPlusReplacer> = {
    bigint: (v: bigint) => [Number(v)],
    symbol: (v: symbol) => [v.description],
  };

  valueReplacers = new Map<unknown, JSONPlusReplacer>([
    [Infinity, () => ['_Infinity']],
    [-Infinity, () => ['_-Infinity']],
    [NaN, () => ['_NaN']],
    [undefined, () => ['_undefined']],
  ]);

  private replace(value: any): any {
    const type = typeof value;
    const typeReplacer = this.typeReplacers[type];
    if (typeReplacer) {
      return [`_${type}`, ...typeReplacer(value)];
    }

    const valueReplacer = this.valueReplacers.get(value);
    if (valueReplacer) {
      return valueReplacer(value);
    }

    if (Object.is(value, -0) && this.negativeZeroReplacer) {
      return this.negativeZeroReplacer(value);
    }

    if (
      value instanceof Array &&
      (typeof value[0] !== 'string' || value[0][0] !== '_')
    ) {
      return value.map((arg) => this.replace(arg));
    }

    if (value instanceof Object) {
      const instanceReplacer = this.instanceReplacers.get(value.constructor);
      if (instanceReplacer) {
        return [
          `_${value.constructor.name}`,
          ...instanceReplacer(value).map((arg) => this.replace(arg)),
        ];
      }

      if (value.constructor === Object) {
        const output: Record<string, unknown> = {};

        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            output[key] = this.replace(value[key]);
          }
        }

        return output;
      }

      return [];
    }

    return value;
  }

  private revive(value: any): any {
    if (value instanceof Array) {
      const [type, ...args] = value;
      if (typeof type !== 'string' || type[0] !== '_') {
        return value.map((arg) => this.revive(arg));
      }

      const name = type.slice(1);

      const reviver = this.revivers[name];
      if (reviver) {
        return reviver(args.map((arg) => this.revive(arg)));
      }

      const Constructor = this.constructors[name];
      if (Constructor) {
        return new Constructor(...args.map((arg) => this.revive(arg)));
      }

      return undefined;
    } else if (value instanceof Object) {
      const output: Record<string, unknown> = {};

      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          output[key] = this.revive(value[key]);
        }
      }

      return output;
    }

    return value;
  }

  /**
   * Converts a JavaScript Object Notation (JSON) string into an object.
   *
   * @param text A valid JSON string.
   * @param reviver A function that transforms the results. This function is called for each member
   * of the object. If a member contains nested objects, the nested objects are transformed before
   * the parent object is.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parse(text: string, reviver?: undefined) {
    return this.revive(JSON.parse(text));
  }

  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   *
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer An array of strings and numbers that acts as an approved list for selecting the
   * object properties that will be stringified.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON
   * text to make it easier to read.
   */
  stringify(value: any, replacer?: null | undefined, space?: string | number) {
    return JSON.stringify(this.replace(value), replacer, space);
  }
}
