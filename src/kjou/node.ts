import { KjouChild, KjouObject } from './types';

export class KjouNode {
  readonly alias: string | null;
  readonly attributes: KjouObject | null;
  readonly children: KjouChild[] | null;
  readonly name: string;

  constructor(
    name: string | [string, string | null],
    attributes: KjouObject | null,
    children: KjouChild[] | null,
  ) {
    this.name = Array.isArray(name) ? name[0] : name;
    this.alias = Array.isArray(name) ? name[1] : null;
    this.attributes = attributes;
    this.children = children;
  }
}
