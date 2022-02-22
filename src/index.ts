/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/ban-types */
export type JSONPlusReplacer = (value?: any) => unknown[];

export type JSONPlusReviver = (args: any[]) => unknown;

export class JSONPlus {
  constructors: Record<string, Function> = {
    /**
     * AggregateError was introduced in Node v15.
     */
    ...((typeof AggregateError === 'undefined' ? {} : { AggregateError }) as {
      AggregateError: AggregateErrorConstructor;
    }),
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
    [BigInt64Array, (v: BigInt64Array) => [[...v]]],
    [BigUint64Array, (v: BigUint64Array) => [[...v]]],
    [Boolean, (v: Boolean) => [v.valueOf()]],
    [DataView, (v: DataView) => [...new Uint8Array(v.buffer)]],
    [Date, (v: Date) => [v.valueOf()]],
    [Error, (v: Error) => [v.message]],
    [EvalError, (v: EvalError) => [v.message]],
    [Float32Array, (v: Float32Array) => [[...v]]],
    [Float64Array, (v: Float64Array) => [[...v]]],
    [Function, (v: Function) => [v.toString()]],
    [Int16Array, (v: Int16Array) => [[...v]]],
    [Int32Array, (v: Int32Array) => [[...v]]],
    [Int8Array, (v: Int8Array) => [[...v]]],
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
    [Uint16Array, (v: Uint16Array) => [[...v]]],
    [Uint32Array, (v: Uint32Array) => [[...v]]],
    [Uint8Array, (v: Uint8Array) => [[...v]]],
    [Uint8ClampedArray, (v: Uint8ClampedArray) => [[...v]]],
  ]);

  negativeZeroReplacer?: JSONPlusReplacer = () => ['-0'];

  revivers: Record<string, JSONPlusReviver> = {
    '-0': () => -0,
    '-Infinity': () => -Infinity,
    Infinity: () => Infinity,
    NaN: () => NaN,
    bigint: (v: any[]) => BigInt(v[0]),
    symbol: (v: any[]) => Symbol(v[0]),
    undefined: () => undefined,
  };

  typeReplacers: Record<string, JSONPlusReplacer> = {
    bigint: (v: bigint) => [Number(v)],
    symbol: (v: symbol) => [v.description],
  };

  valueReplacers = new Map<unknown, JSONPlusReplacer>([
    [Infinity, () => ['Infinity']],
    [-Infinity, () => ['-Infinity']],
    [NaN, () => ['NaN']],
    [undefined, () => ['undefined']],
  ]);

  private replace(value: unknown): unknown {
    const type = typeof value;
    const typeReplacer = this.typeReplacers[type];
    if (typeReplacer) {
      return [type, ...typeReplacer(value)];
    }

    const valueReplacer = this.valueReplacers.get(value);
    if (valueReplacer) {
      return valueReplacer(value);
    }

    if (Object.is(value, -0) && this.negativeZeroReplacer) {
      return this.negativeZeroReplacer(value);
    }

    if (value instanceof Object) {
      const instanceReplacer = this.instanceReplacers.get(value.constructor);
      if (instanceReplacer) {
        return [
          value.constructor.name,
          ...instanceReplacer(value).map((arg) => this.replace(arg)),
        ];
      }

      if (value.constructor === Object) {
        const output: Record<string, unknown> = {};

        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            output[key] = this.replace((value as any)[key]);
          }
        }

        return output;
      }

      return [];
    }

    return value;
  }

  private revive(value: unknown): unknown {
    if (value instanceof Array) {
      const [name, ...args] = value;

      const reviver = this.revivers[name];
      if (reviver) {
        return this.revive(reviver(args));
      }

      const Constructor: any = this.constructors[name];
      if (Constructor) {
        return new Constructor(...args.map((arg) => this.revive(arg)));
      }

      return undefined;
    } else if (value instanceof Object) {
      const output: Record<string, unknown> = {};

      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          output[key] = this.revive((value as any)[key]);
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
   * @param reviver Not used.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parse(text: string, reviver?: null) {
    return this.revive(JSON.parse(text));
  }

  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   *
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer Not used.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  stringify(value: any, replacer?: null, space?: string | number) {
    return JSON.stringify(this.replace(value), replacer, space);
  }
}
