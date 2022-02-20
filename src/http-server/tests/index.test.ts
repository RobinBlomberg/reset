import { deepStrictEqual } from 'assert';
import { HttpServer } from 'http-server';
import { KjouNode } from 'kjou';
import { KjouJs } from 'kjou-js';

const PORT = 3000;

export const testHttpServer = async () => {
  const USERS = [
    { email: 'frank@example.com', id: 1, name: 'Frank', role: 'EDITOR' },
    { email: 'anna@example.com', id: 2, name: 'Anna', role: 'ADMIN' },
    { email: 'bobby@example.com', id: 3, name: 'Bobby', role: 'EDITOR' },
    { email: 'emilia@example.com', id: 4, name: 'Emilia', role: 'ADMIN' },
    { email: 'carmen@example.com', id: 5, name: 'Carmen', role: 'ADMIN' },
    { email: 'lars@example.com', id: 6, name: 'Lars', role: 'EDITOR' },
  ];

  const pick = (object: Record<string, unknown>, keys: string[]) => {
    const output: Record<string, unknown> = {};

    for (const key of keys) {
      output[key] = object[key];
    }

    return output;
  };

  const httpServer = new HttpServer({
    methods: {
      add: (a: number, b: number) => a + b,
      reverse: (array: unknown[]) => array.reverse(),
      users(this: KjouNode) {
        return USERS.filter((row) => {
          const rawRole = this.props?.attributes.role;
          const role = rawRole instanceof KjouNode ? rawRole.name : undefined;
          return role ? row.role === role : true;
        }).map((row) => {
          const keys: string[] = [];
          for (const child of this.children ?? []) {
            if (child instanceof KjouNode) {
              keys.push(child.name);
            }
          }
          return pick(row, keys);
        });
      },
    },
    port: PORT,
  });

  httpServer.start();

  const response = await fetch(`http://localhost:${PORT}`, {
    body: `users(role: ADMIN) {
      email
      name
    }`,
    method: 'POST',
  });
  const body = await response.text();
  const returnee = KjouJs.parseValue(body);

  deepStrictEqual(
    returnee,
    USERS.filter((user) => user.role === 'ADMIN').map(({ email, name }) => ({
      email,
      name,
    })),
  );

  httpServer.stop();
};
