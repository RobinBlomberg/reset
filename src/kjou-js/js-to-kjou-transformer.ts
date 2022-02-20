import { KjouNode, KjouObject, KjouValue } from '~kjou';
import { DECONSTRUCTORS } from './constants';
import { Deconstructor, GlobalConstructorName } from './types';

export class JsToKjouTransformer {
  transformArray(node: unknown[]) {
    const output: KjouValue[] = [];

    for (const item of node) {
      output.push(this.transformValue(item));
    }

    return output;
  }

  transformObject(node: Record<string | number | symbol, unknown>) {
    const name = node.constructor.name as GlobalConstructorName;
    const deconstructor =
      name === 'Object' ? null : (DECONSTRUCTORS[name] as Deconstructor | null);

    if (deconstructor) {
      const args = deconstructor(node);
      return new KjouNode({
        name,
        props: {
          args: this.transformArray(args),
        },
      });
    }

    const output: KjouObject = {};

    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        const value = node[key];
        output[key] = this.transformValue(value);
      }
    }

    return output;
  }

  transformValue(node: unknown): KjouValue {
    if (Array.isArray(node)) {
      return this.transformArray(node);
    } else if (node instanceof Object) {
      return this.transformObject(
        node as Record<string | number | symbol, unknown>,
      );
    }

    const type = typeof node;
    switch (type) {
      case 'boolean':
      case 'number':
      case 'string':
        return node as boolean | number | string;
      default:
        return (node ?? undefined) as null | undefined;
    }
  }
}
