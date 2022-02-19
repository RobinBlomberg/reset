import { strictEqual } from 'assert';
import { KjouNode } from '../../kjou/node';
import { KjouHtmlCompiler } from '../compiler';

export const testKjouHtmlCompiler = () => {
  strictEqual(
    new KjouHtmlCompiler().compile([
      new KjouNode('!DOCTYPE', { html: undefined }, null),
      new KjouNode('html', { lang: 'en-US' }, [
        new KjouNode('head', null, [
          new KjouNode('title', null, ['Untitled Document']),
        ]),
        new KjouNode('body', null, [
          new KjouNode(['h1', 'test'], null, ['0']),
          new KjouNode('button', { disabled: undefined, removeMe: null }, [
            'Increment',
          ]),
        ]),
      ]),
    ]),
    '<!DOCTYPE html><html lang="en-US"><head><title>Untitled Document</title></head><body>' +
      '<h1>0</h1><button disabled>Increment</button></body></html>',
  );
};
