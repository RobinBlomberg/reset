import { JSONPlus } from '.';

const JSON = new JSONPlus();
const buffer = new ArrayBuffer(2);
const dataView = new DataView(buffer);
dataView.setInt16(0, 643, true);

const input: unknown = dataView.buffer;
console.log(input);

const json = JSON.stringify(input);
console.log(json);

const output = JSON.parse(json);
console.dir(output, { depth: null });
