import { KjouConstructorParameterGetter } from './types';

export const KjouConstructorParameterGetters = new Map<
  Function,
  KjouConstructorParameterGetter
>([
  [
    Boolean,
    (boolean: boolean) => {
      return [boolean.valueOf()];
    },
  ],
  [
    Date,
    (date: Date) => {
      return [date.valueOf()];
    },
  ],
  [
    Error,
    (error: Error) => {
      return [error.message];
    },
  ],
  [
    Function,
    (fn: Function) => {
      return ['...a', `return (${fn.toString()})(...a);`];
    },
  ],
  [
    Map,
    (map: Map<unknown, unknown>) => {
      return [[...map.entries()]];
    },
  ],
  [
    Number,
    (number: number) => {
      return [number.valueOf()];
    },
  ],
  [
    RegExp,
    (regExp: RegExp) => {
      return [regExp.source, ...(regExp.flags ? [regExp.flags] : [])];
    },
  ],
  [
    Set,
    (set: Set<unknown>) => {
      return [[...set.values()]];
    },
  ],
  [
    String,
    (string: string) => {
      return [string.valueOf()];
    },
  ],
]);

export const getConstructor = (value: Record<string, unknown>) => {
  let { constructor } = value;
  const { name } = constructor;

  while (typeof constructor === 'function') {
    const getParameters = KjouConstructorParameterGetters.get(constructor);

    if (getParameters) {
      const args = getParameters(value);
      return { args, name };
    }

    constructor = Object.getPrototypeOf(constructor);
  }

  return null;
};
