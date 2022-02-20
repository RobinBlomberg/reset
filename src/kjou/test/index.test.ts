import { testInterface } from './kjou.test';
import { testParser } from './parser.test';
import { testSerializer } from './serializer.test';

export const testKjou = async () => {
  await testParser();
  await testSerializer();
  await testInterface();
};
