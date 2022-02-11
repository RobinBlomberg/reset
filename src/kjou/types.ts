import { KjouNode } from './node';

export type KjouChild = KjouNode | string;

export type KjouObject = {
  [K in string]: KjouValue;
};

export type KjouValue =
  | KjouObject
  | KjouValue[]
  | string
  | number
  | boolean
  | null
  | undefined;
