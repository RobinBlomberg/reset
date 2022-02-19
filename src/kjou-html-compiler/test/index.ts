import { strictEqual } from 'assert';
import { KjouNode } from '../../kjou/node';
import { KjouHtmlCompiler } from '../compiler';

export const testKjouHtmlCompiler = () => {
  strictEqual(
    new KjouHtmlCompiler().compile([
      new KjouNode({
        name: '!DOCTYPE',
        props: { args: [new KjouNode({ name: 'html' })] },
      }),
      new KjouNode({
        children: [
          new KjouNode({
            children: [
              new KjouNode({ children: ['Untitled Document'], name: 'title' }),
            ],
            name: 'head',
          }),
          new KjouNode({
            children: [
              new KjouNode({ alias: 'test', children: ['0'], name: 'h1' }),
              new KjouNode({
                children: ['Increment'],
                name: 'button',
                props: {
                  args: [new KjouNode({ name: 'disabled' })],
                  attributes: { removeMe: null },
                },
              }),
            ],
            name: 'body',
          }),
        ],
        name: 'html',
        props: { attributes: { lang: 'en-US' } },
      }),
    ]),
    '<!DOCTYPE html><html lang="en-US"><head><title>Untitled Document</title></head><body>' +
      '<h1>0</h1><button disabled>Increment</button></body></html>',
  );
};
