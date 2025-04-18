import { INITIAL, type Registry } from 'vscode-textmate';
import { TMToMonacoToken } from './tm-to-monaco-token';

export interface StackElement {
  _stackElementBrand: unknown;
  readonly depth: number;

  clone(): StackElement;
  equals(other: StackElement): boolean;
}

class TokenizerState implements monaco.languages.IState {
  constructor(private _ruleStack: StackElement) {}

  public get ruleStack(): StackElement {
    return this._ruleStack;
  }

  public clone(): TokenizerState {
    return new TokenizerState(this._ruleStack);
  }

  public equals(other: monaco.languages.IState): boolean {
    if (
      !other ||
      !(other instanceof TokenizerState) ||
      other !== this ||
      other._ruleStack !== this._ruleStack
    ) {
      return false;
    }
    return true;
  }
}

/**
 * Wires up monaco-editor with monaco-textmate
 *
 * @param _monaco monaco namespace this operation should apply to (usually the `monaco` global unless you have some other setup)
 * @param registry TmGrammar `Registry` this wiring should rely on to provide the grammars
 * @param languages `Map` of language ids (string) to TM names (string)
 */
export function wireTmGrammars(
  _monaco: typeof monaco,
  registry: Registry,
  languages: Map<string, string>,
  editor?: monaco.editor.ICodeEditor,
) {
  return Promise.all(
    Array.from(languages.keys()).map(async (languageId) => {
      const scopeName = languages.get(languageId);
      if (scopeName == null) return;
      const grammar = await registry.loadGrammar(scopeName);
      if (grammar == null) return;

      _monaco.languages.setTokensProvider(languageId, {
        getInitialState: () => new TokenizerState(INITIAL),
        // @ts-ignore
        tokenize: (line: string, state: TokenizerState) => {
          // @ts-ignore
          const res = grammar.tokenizeLine(line, state.ruleStack);
          return {
            endState: new TokenizerState(res.ruleStack),
            tokens: res.tokens.map((token) => ({
              ...token,
              // TODO: At the moment, monaco-editor doesn't seem to accept array of scopes
              scopes: editor
                ? TMToMonacoToken(editor, token.scopes)
                : token.scopes[token.scopes.length - 1],
            })),
          };
        },
      });
    }),
  );
}
