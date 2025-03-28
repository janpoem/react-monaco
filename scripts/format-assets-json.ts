import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const writeJsonFile = (item: string, path: string, data: unknown): void => {
  try {
    writeFileSync(path, JSON.stringify(data));
    console.warn(`write file ${item}`);
  } catch (err) {
    console.warn(`parse ${item} json error: ${err}`);
  }
};

const main = (items: string[]) => {
  for (const item of items) {
    const path = resolve(process.cwd(), item);
    const text = readFileSync(path, 'utf8').toString();
    try {
      const json = JSON.parse(text);
      writeJsonFile(item, path, json);
    } catch (err) {
      console.warn(`parse ${item} json error: ${err}`);
    }
  }
};

main(globSync(['./packages/assets/assets/**/*.json']));
