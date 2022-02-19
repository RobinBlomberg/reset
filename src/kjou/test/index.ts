import { testParser } from './parser.test';
import { testSerializer } from './serializer.test';

export const testKjou = async () => {
  await Promise.all([testParser(), testSerializer()]);
};
