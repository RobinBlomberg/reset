import { KjouChild, KjouObject } from './types';

export class KjouNode {
  readonly attributes: KjouObject | null;
  readonly children: KjouChild[] | null;
  readonly name: string;

  constructor(
    name: string,
    attributes: KjouObject | null,
    children: KjouChild[] | null,
  ) {
    this.name = name;
    this.attributes = attributes;
    this.children = children;
  }
}
