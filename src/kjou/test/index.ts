import { testParser } from './parser.test';

export const testKjou = async () => {
  await Promise.all([testParser()]);
};
