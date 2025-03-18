// ref: https://codesandbox.io/p/sandbox/vscode-textmate-p58qlu?file=%2Fsrc%2Fgrammar.js%3A4%2C1-13%2C3
import { OnigScanner, OnigString } from 'vscode-oniguruma';
import { parseRawGrammar, Registry } from 'vscode-textmate';

const PLISTS: Record<string, string> = {
  'source.asp.vb.net':
    'https://raw.githubusercontent.com/textmate/asp.vb.net.tmbundle/master/Syntaxes/ASP%20VB.net.plist',
  'source.js':
    'https://raw.githubusercontent.com/textmate/javascript.tmbundle/master/Syntaxes/JavaScript.plist',
  'source.ruby':
    'https://raw.githubusercontent.com/textmate/ruby.tmbundle/master/Syntaxes/Ruby.plist',
  'source.cpp':
    'https://raw.githubusercontent.com/textmate/cpp-qt.tmbundle/master/Syntaxes/Qt%20C%2B%2B.tmLanguage',
  // 'source.dbml': '/json/dbml.json',
  // 'source.rs': '/json/rust.tmLanguage.json',
  // 'source.ts': '/json/TypeScript.tmLanguage.json',
  // 'source.tsx': '/json/TypeScriptReact.tmLanguage.json',
};

const cache: Record<string, string> = {};
async function getPlist(scopeName: string) {
  if (!cache[scopeName]) {
    cache[scopeName] = await fetch(PLISTS[scopeName]).then((response) =>
      response.text(),
    );
  }
  return cache[scopeName];
}

export function getRegistry() {
  return new Registry({
    onigLib: {
      // @ts-ignore
      createOnigScanner(patterns: string[]) {
        return new OnigScanner(patterns);
      },
      createOnigString(s: string) {
        return new OnigString(s);
      },
    },
    async loadGrammar(scopeName: string) {
      if (PLISTS[scopeName]) {
        const data = await getPlist(scopeName);
        return parseRawGrammar(data);
      }
      return null;
    },
  });
}
