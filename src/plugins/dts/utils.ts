// const getRefPattern = () =>
//   /^\/{3}[\s\t]+\<reference[\s\t]+path=[\'\"]([^\"\']+)[\'\"].*\/\>/gm;

const getImportPattern = () =>
  /^(?:(import|export) .*|\})? from [\'\"]([^\"\']+)[\'\"];?$/gm;

export const parseSourceDeps = (source: string, libs: Set<string>) => {
  // 暂时这里先用粗暴的正则表达式
  const matches = source.matchAll(getImportPattern());

  for (const match of matches) {
    if (!match[2].startsWith('.')) {
      libs.add(match[2]);
    }
  }

  return libs;
};
