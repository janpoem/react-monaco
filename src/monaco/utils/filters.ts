export const filterTheme = (value?: string) => {
  if (value == null) {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    return query.matches ? 'vs-dark' : 'vs-light';
  }
  return value;
};
