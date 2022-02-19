import { deepStrictEqual } from 'assert';
import { KjouNode } from '../../node';
import { KjouParser } from '../../parser';

deepStrictEqual(
  new KjouParser('name').parseNode(),
  new KjouNode('name', null, null),
);

// Attributes:
deepStrictEqual(new KjouParser('a()').parseNode(), new KjouNode('a', {}, null));
deepStrictEqual(
  new KjouParser('meta(name:description)').parseNode(),
  new KjouNode('meta', { name: 'description' }, null),
);
deepStrictEqual(
  new KjouParser('foo ( bar : baz qux : -0 , a b ) ').parseNode(),
  new KjouNode(
    'foo',
    { a: undefined, b: undefined, bar: 'baz', qux: -0 },
    null,
  ),
);

// Children:
deepStrictEqual(new KjouParser('_{}').parseNode(), new KjouNode('_', null, []));
deepStrictEqual(
  new KjouParser('0-1(){}').parseNode(),
  new KjouNode('0-1', {}, []),
);
deepStrictEqual(
  new KjouParser(
    `html(lang: en-US) {
      head {
        meta(name: 'description')
        meta(http-equiv: X-UA-Compatible, content: 'IE=edge')
        title{'Untitled Document'}
      }
      body {
        'Hello world!'
      }
    }`,
  ).parseNode(),
  new KjouNode('html', { lang: 'en-US' }, [
    new KjouNode('head', null, [
      new KjouNode('meta', { name: 'description' }, null),
      new KjouNode(
        'meta',
        { content: 'IE=edge', 'http-equiv': 'X-UA-Compatible' },
        null,
      ),
      new KjouNode('title', null, ['Untitled Document']),
    ]),
    new KjouNode('body', null, ['Hello world!']),
  ]),
);
deepStrictEqual(
  new KjouParser(
    `fragment comparisonFields on Character {
      name
      friendsConnection(first: $first) {
        totalCount
        edges {
          node {
            name
          }
        }
      }
    }`,
  ).parseDocument(),
  [
    new KjouNode('fragment', null, null),
    new KjouNode('comparisonFields', null, null),
    new KjouNode('on', null, null),
    new KjouNode('Character', null, [
      new KjouNode('name', null, null),
      new KjouNode('friendsConnection', { first: '$first' }, [
        new KjouNode('totalCount', null, null),
        new KjouNode('edges', null, [
          new KjouNode('node', null, [new KjouNode('name', null, null)]),
        ]),
      ]),
    ]),
  ],
);

// Aliases:
deepStrictEqual(
  new KjouParser(
    `query {
      empireHero:hero(episode: EMPIRE) {
        name
      }
      jediHero  :  hero  (  episode  :  JEDI  )  {
        name
      }
    }`,
  ).parseDocument(),
  [
    new KjouNode('query', null, [
      new KjouNode(['hero', 'empireHero'], { episode: 'EMPIRE' }, [
        new KjouNode('name', null, null),
      ]),
      new KjouNode(['hero', 'jediHero'], { episode: 'JEDI' }, [
        new KjouNode('name', null, null),
      ]),
    ]),
  ],
);