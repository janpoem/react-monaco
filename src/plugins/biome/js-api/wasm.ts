/******************************************************************************
 * - ref: https://biomejs.dev/
 * - ref: https://www.npmjs.com/package/@biomejs/js-api
 * - ref: https://github.com/biomejs/biome/blob/main/packages/%40biomejs/js-api/src/wasm.ts
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
////////////////////////////////////////////////////////////////////////////////
/*
export type WasmBundler = typeof import('@biomejs/wasm-bundler');
export type WasmNodejs = typeof import('@biomejs/wasm-nodejs');
export type WasmWeb = typeof import('@biomejs/wasm-web');

export type WasmModule = WasmBundler | WasmNodejs | WasmWeb;
*/
////////////////////////////////////////////////////////////////////////////////

import type { InitInput } from './wasm-web';

export type WasmWeb = typeof import('./wasm-web');

export type WasmModule = WasmWeb;

/**
 * What kind of client Biome should use to communicate with the binary
 */
export enum Distribution {
  /**
   * Use this if you want to communicate with the WebAssembly client built for bundlers
   */
  BUNDLER = 0,
  /**
   * Use this if you want to communicate with the WebAssembly client built for Node.JS
   */
  NODE = 1,
  /**
   * Use this if you want to communicate with the WebAssembly client built for the Web
   */
  WEB = 2,
}

const isInitialized = {
  [Distribution.BUNDLER]: false,
  [Distribution.NODE]: false,
  [Distribution.WEB]: false,
};

export async function loadModule(
  dist: Distribution,
  input?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<WasmModule> {
  // biome-ignore lint/style/useConst: <explanation>
  let modulePromise: Promise<WasmModule>;

  ////////////////////////////////////////////////////////////////////////////////
  /*
  switch (dist) {
    case Distribution.BUNDLER: {
      modulePromise = import('@biomejs/wasm-bundler');
      break;
    }
    case Distribution.NODE: {
      modulePromise = import('@biomejs/wasm-nodejs');
      break;
    }
    case Distribution.WEB: {
      modulePromise = import('@biomejs/wasm-web');
      break;
    }
  }
   */
  ////////////////////////////////////////////////////////////////////////////////

  modulePromise = import('./wasm-web');

  const module = await modulePromise;

  if (!isInitialized[dist]) {
    isInitialized[dist] = true;
    // modify by janpoem
    // module.main();
    // @ts-ignore
    await module.default(input);
  }

  return module;
}

/**
 * The error generated when communicating with WebAssembly
 */
class WasmError extends Error {
  /**
   * The stack trace of the error.
   *
   * It might be useful, but the first like of the stack trace contains the error
   */
  stackTrace: string;
  private constructor(stackTrace: string) {
    super();
    this.stackTrace = stackTrace;
  }

  static fromError(e: unknown): WasmError {
    return new WasmError(e as string);
  }
}

/**
 * Creates wrap a WebAssembly error into a native JS Error
 *
 * @param e
 */
export function wrapError(e: unknown): WasmError {
  console.warn('wrapError', e);
  return WasmError.fromError(e);
}
