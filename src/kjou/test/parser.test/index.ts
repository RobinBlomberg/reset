export const testParser = async () => {
  await import('./number.test');
  await import('./string.test');
  await import('./enum.test');
  await import('./array.test');
  await import('./object.test');
  await import('./value.test');
  await import('./node.test');
  await import('./document.test');
};
