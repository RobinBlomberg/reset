export const testParser = async () => {
  await Promise.all([
    import('./array.test'),
    import('./enum.test'),
    import('./node.test'),
    import('./number.test'),
    import('./object.test'),
    import('./string.test'),
  ]);
};
