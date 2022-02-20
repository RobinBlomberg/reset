import { testInterface } from './kjou';
import { testParser } from './parser';
import { testSerializer } from './serializer';

export const testKjou = async () => {
  await testParser();
  await testSerializer();
  await testInterface();
};
