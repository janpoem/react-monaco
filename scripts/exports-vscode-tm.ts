import { notEmptyStr } from '@zenstone/ts-utils';
import { glob } from 'glob';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const tmEnd = '.tmLanguage.json';

export const parseFilename = (filename: string) => {
  const index = filename.indexOf(tmEnd);
  return [filename.substring(0, index), filename.substring(index)];
};

export const exportsVscodeTm = async () => {
  const root = process.env.VSCODE_SOURCE_ROOT;

  if (!notEmptyStr(root) || !existsSync(root)) {
    throw new Error(
      'Please specify a valid VSCODE_SOURCE_ROOT constant in your .env file',
    );
  }

  const res = await glob(`${root}/**/*.tmLanguage.json`);

  const records: string[] = [];

  for (const it of res) {
    const path = resolve(it);
    const filename = basename(path);
    const [base, ext] = parseFilename(filename);
    const baseLower = base.toLowerCase();
    records.push(baseLower);

    // cpSync(path, resolve(process.cwd(), `tm/${baseLower}${ext}`));
    try {
      const content = readFileSync(path).toString();
      const json = JSON.parse(content);
      writeFileSync(
        resolve(process.cwd(), `tm/${baseLower}${ext}`),
        JSON.stringify(json),
      );
    } catch (err) {
      console.log(`file ${filename} json handle error: ${err}`);
    }
  }

  writeFileSync(
    resolve(process.cwd(), 'tm/_tmLanguages.json'),
    JSON.stringify(records),
  );
};

if (import.meta.main) {
  exportsVscodeTm();
}
