import { KjouNode } from '~kjou';

export type KjouChild = KjouNode | string;

export type KjouObject = {
  [K in string]: KjouValue;
};

export type KjouProps = {
  args: KjouValue[];
  attributes: KjouObject;
};

export type KjouSerializerOptions = {
  pretty?: boolean;
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
