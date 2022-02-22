import { JSONPlus } from '.';

const JSON = new JSONPlus();
const input: unknown = new Promise(() => {});
const json = JSON.stringify(input);
const output = JSON.parse(json);

console.log(json);
console.dir(output, { depth: null });
