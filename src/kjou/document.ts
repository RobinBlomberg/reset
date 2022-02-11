import { KjouNode } from './node';

export class KjouDocument {
  readonly children: KjouNode[];

  constructor(children: KjouNode[]) {
    this.children = children;
  }

  toHtml() {
    let html = '';

    for (const child of this.children) {
      html += child.toHtml();
    }

    return html;
  }
}
