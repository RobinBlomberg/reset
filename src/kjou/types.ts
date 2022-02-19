import { KjouNode } from './node';

export type KjouChild = KjouNode | string;

export type KjouConstructorParameterGetter = (value: any) => unknown[];

export type KjouObject = {
  [K in string]: KjouValue;
};

export type KjouProps = {
  args: KjouValue[];
  attributes: KjouObject;
};

export type KjouValue =
  | KjouNode
  | KjouObject
  | KjouValue[]
  | string
  | number
  | boolean
  | null
  | undefined;
