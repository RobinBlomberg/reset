import { KjouChild, KjouObject, KjouProps, KjouValue } from './types';

export class KjouNode {
  readonly alias?: string;
  readonly children?: KjouChild[];
  readonly name: string;
  readonly props?: KjouProps;

  constructor({
    alias,
    children,
    name,
    props,
  }: {
    alias?: string;
    children?: KjouChild[];
    name: string;
    props?: {
      args?: KjouValue[];
      attributes?: KjouObject;
    };
  }) {
    this.name = name;

    if (alias) {
      this.alias = alias;
    }

    if (props) {
      this.props = {
        args: props.args ?? [],
        attributes: props.attributes ?? {},
      };
    }

    if (children) {
      this.children = children;
    }
  }
}
