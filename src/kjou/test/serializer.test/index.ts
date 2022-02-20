export const testSerializer = async () => {
  await import('./non-pretty.test');
  await import('./pretty.test');
};
