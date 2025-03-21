/******************************************************************************
 * - ref: https://biomejs.dev/
 * - ref: https://www.npmjs.com/package/@biomejs/js-api
 * - ref: https://github.com/biomejs/biome/blob/main/packages/%40biomejs/js-api/src/index.ts
 ******************************************************************************
 * MIT License
 *
 * Copyright (c) 2023 Biome Developers and Contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/

import { Distribution, loadModule, type WasmModule, wrapError } from './wasm';
import type {
  BiomePath,
  Diagnostic,
  DiagnosticPrinter,
  FileKind,
  FileKind2,
  FixFileMode,
  InitInput,
  PartialConfiguration as Configuration,
  ProjectKey,
  Workspace,
} from './wasm-web';

// Re-export of some useful types for users
export type { Diagnostic, Configuration, Workspace, DiagnosticPrinter };
export { Distribution };

export interface FormatContentDebugOptions extends FormatContentOptions {
  /**
   * If `true`, you'll be able to inspect the IR of the formatter
   */
  debug: boolean;
}

export interface FormatContentOptions {
  /**
   * A virtual path of the file. You should add the extension,
   * so Biome knows how to parse the content
   */
  filePath: string;
  /**
   * The range where to format the content
   */
  range?: [number, number];
}

export interface FormatResult {
  /**
   * The new formatted content
   */
  content: string;
  /**
   * A series of errors encountered while executing an operation
   */
  diagnostics: Diagnostic[];
}

export interface FormatDebugResult extends FormatResult {
  /**
   * The IR emitted by the formatter
   */
  ir: string;
}

export interface LintContentOptions {
  /**
   * A virtual path of the file. You should add the extension,
   * so Biome knows how to parse the content
   */
  filePath: string;
  fixFileMode?: FixFileMode;
}

export interface LintResult {
  content: string;
  diagnostics: Diagnostic[];
}

function isFormatContentDebug(
  options: FormatContentOptions | FormatContentDebugOptions,
): options is FormatContentDebugOptions {
  return 'debug' in options && options.debug !== undefined;
}

export interface BiomeCreate {
  // modify by janpoem
  distribution?: Distribution;
  // modify by janpoem
  // align to __wbg_init input arg
  input?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>;
}

export interface PrintDiagnosticsOptions {
  /**
   * The name of the file to print diagnostics for
   */
  filePath: string;
  /**
   * The content of the file the diagnostics were emitted for
   */
  fileSource: string;
  /**
   * Whether to print the diagnostics in verbose mode
   */
  verbose?: boolean;
}

export class Biome {
  #curProjectKey: ProjectKey = '';

  private constructor(
    public readonly module: WasmModule,
    public readonly workspace: Workspace,
  ) {}

  /**
   * It creates a new instance of the class {Biome}.
   */
  static async create(
    // modify janpoem
    { distribution, input }: BiomeCreate = {},
  ): Promise<Biome> {
    // modify janpoem
    const module = await loadModule(distribution ?? Distribution.WEB, {
      module_or_path: input,
    });
    const workspace = new module.Workspace();
    const biome = new Biome(module, workspace);
    biome.#curProjectKey = biome.openProject();
    return biome;
  }

  /**
   * Stop this instance of Biome
   *
   * After calling `shutdown()` on this object, it should be considered
   * unusable as calling any method on it will fail
   */
  shutdown() {
    this.workspace.free();
  }

  get projectKey() {
    return this.#curProjectKey;
  }

  /**
   * Allows to apply a custom configuration.
   *
   * If fails when the configuration is incorrect.
   *
   * @param {ProjectKey} projectKey The identifier of the project
   * @param {Configuration} configuration
   */
  applyConfiguration(
    configuration: Configuration,
    projectKey?: ProjectKey,
  ): void {
    try {
      this.workspace.updateSettings({
        projectKey: projectKey ?? this.projectKey,
        configuration,
        gitignore_matches: [],
        // ? or workspace_directory? @janpoem
        workspace_directory: './',
      });
    } catch (e) {
      throw wrapError(e);
    }
  }

  /**
   * Open a possible workspace project folder. Returns the key of said project. Use this key when you want to switch to different projects.
   *
   * @param {string} [path]
   */
  openProject(path?: string): ProjectKey {
    // 当前版本的有效做法
    return this.workspace.registerProjectFolder({
      path,
      setAsCurrentWorkspace: true,
    });
    // 未定义的方法 ? @janpoem openProject
    // return this.workspace.openProject({
    //   path: path || '',
    //   openUninitialized: true,
    // });
  }

  newBiomePath = (
    path: string | BiomePath,
    kindOrKinds: FileKind2 | FileKind = ['Handleable'],
    was_written = false,
  ): BiomePath => {
    if (this.isBiomePath(path)) return path;
    const kind = Array.isArray(kindOrKinds) ? kindOrKinds : [kindOrKinds];
    return { path, kind, was_written };
  };

  isBiomePath = (input: string | BiomePath): input is BiomePath => {
    return (
      typeof input === 'object' &&
      !Array.isArray(input) &&
      typeof input.path === 'string' &&
      Array.isArray(input.kind)
    );
  };

  private tryCatchWrapper<T>(func: () => T): T {
    try {
      return func();
    } catch (err) {
      throw wrapError(err);
    }
  }

  private withFile<T>(
    inputPath: string | BiomePath,
    content: string,
    func: (path: BiomePath) => T,
  ): T {
    return this.tryCatchWrapper(() => {
      const path = this.newBiomePath(inputPath);
      this.workspace.openFile({
        content,
        // content: { type: 'fromClient', content, version: 0 },
        path,
        version: 0,
      });

      try {
        return func(path);
      } finally {
        this.workspace.closeFile({ path });
      }
    });
  }

  formatContent(
    // projectKey: ProjectKey,
    content: string,
    options: FormatContentOptions,
  ): FormatResult;
  formatContent(
    // projectKey: ProjectKey,
    content: string,
    options: FormatContentDebugOptions,
  ): FormatDebugResult;

  /**
   * If formats some content.
   *
   * @param {ProjectKey} projectKey The identifier of the project
   * @param {String} content The content to format
   * @param {FormatContentOptions | FormatContentDebugOptions} options Options needed when formatting some content
   */
  formatContent(
    // projectKey: ProjectKey,
    content: string,
    options: FormatContentOptions | FormatContentDebugOptions,
  ): FormatResult | FormatDebugResult {
    return this.withFile(options.filePath, content, (path) => {
      let code = content;

      const { diagnostics } = this.workspace.pullDiagnostics({
        // projectKey,
        path,
        categories: ['Syntax'],
        max_diagnostics: Number.MAX_SAFE_INTEGER,
        only: [],
        skip: [],
      });

      const hasErrors = diagnostics.some(
        (diag) => diag.severity === 'fatal' || diag.severity === 'error',
      );
      if (!hasErrors) {
        if (options.range) {
          const result = this.workspace.formatRange({
            path,
            range: options.range,
          });
          code = result.code;
        } else {
          const result = this.workspace.formatFile({
            path,
          });
          code = result.code;
        }

        if (isFormatContentDebug(options)) {
          const ir = this.workspace.getFormatterIr({
            path,
          });

          return {
            content: code,
            diagnostics,
            ir,
          };
        }
      }

      return {
        content: code,
        diagnostics,
      };
    });
  }

  /**
   * Lint the content of a file.
   *
   * @param {ProjectKey} projectKey The identifier of the project
   * @param {String} content The content to lint
   * @param {LintContentOptions} options Options needed when linting some content
   */
  lintContent(
    // projectKey: ProjectKey,
    content: string,
    { filePath, fixFileMode }: LintContentOptions,
  ): LintResult {
    const maybeFixedContent = fixFileMode
      ? this.withFile(filePath, content, (path) => {
          let code = content;

          const result = this.workspace.fixFile({
            // projectKey,
            path,
            fix_file_mode: fixFileMode,
            should_format: false,
            only: [],
            skip: [],
            rule_categories: ['Syntax', 'Lint'],
          });

          code = result.code;

          return code;
        })
      : content;

    return this.withFile(filePath, maybeFixedContent, (path) => {
      const { diagnostics } = this.workspace.pullDiagnostics({
        // projectKey,
        path,
        categories: ['Syntax', 'Lint'],
        max_diagnostics: Number.MAX_SAFE_INTEGER,
        only: [],
        skip: [],
      });

      return {
        content: maybeFixedContent,
        diagnostics,
      };
    });
  }

  /**
   * Print a list of diagnostics to an HTML string.
   *
   * @param {Diagnostic[]} diagnostics The list of diagnostics to print
   * @param {PrintDiagnosticsOptions} options Options needed for printing the diagnostics
   */
  printDiagnostics(
    diagnostics: Diagnostic[],
    options: PrintDiagnosticsOptions,
  ): string {
    return this.tryCatchWrapper(() => {
      const printer = new this.module.DiagnosticPrinter(
        options.filePath,
        options.fileSource,
      );

      try {
        for (const diag of diagnostics) {
          if (options.verbose) {
            printer.print_verbose(diag);
          } else {
            printer.print_simple(diag);
          }
        }
        return printer.finish();
      } catch (err) {
        // Only call `free` if the `print` method throws, `finish` will
        // take care of deallocating the printer even if it fails
        printer.free();
        throw err;
      }
    });
  }
}
