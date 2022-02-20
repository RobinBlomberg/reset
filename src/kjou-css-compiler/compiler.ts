import { KjouNode, KjouValue } from '~kjou';
import { KjouHtmlCompiler } from '~kjou-html-compiler';

export class KjouCssCompiler {
  private readonly htmlCompiler = new KjouHtmlCompiler();

  compile(node: KjouNode | KjouNode[]) {
    if (Array.isArray(node)) {
      let css = '';

      for (const child of node) {
        css += this.compile(child);
      }

      return css;
    }

    if (!node.children || node.children.length === 0) {
      return '';
    }

    let bodyCss = '';

    for (const child of node.children) {
      if (typeof child !== 'string') {
        if (child.alias && !child.children) {
          bodyCss += `${child.alias}:${child.name};`;
        } else {
          bodyCss += this.compile(child);
        }
      }
    }

    if (!bodyCss) {
      return '';
    }

    let css = node.name;

    if (node.props) {
      const isAtRule = node.name[0] === '@';

      if (isAtRule) {
        css += '(';
      }

      for (const key in node.props.attributes) {
        if (Object.prototype.hasOwnProperty.call(node.props.attributes, key)) {
          const value = node.props.attributes[key];

          if (isAtRule) {
            css += `${this.compileValue(key)}:${this.compileValue(value)}`;
          } else {
            const compiledAttribute = this.htmlCompiler.compileAttribute(
              key,
              value,
            );

            if (compiledAttribute) {
              css += `[${compiledAttribute}]`;
            }
          }
        }
      }

      if (isAtRule) {
        css += ')';
      }
    }

    css += `{${bodyCss}}`;

    return css;
  }

  compileValue(value: KjouValue) {
    return value instanceof KjouNode ? value.name : String(value);
  }
}
