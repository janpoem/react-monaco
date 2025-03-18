import { isNumber } from '@zenstone/ts-utils/number';
import { unmountRemote } from '@zenstone/ts-utils/remote';
import type { Position } from 'monaco-editor';
import { type RefObject, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { type MonacoCodeEditorRef, MonacoReadyState } from '../../monaco';

/**
 * 切换 Locale 的 hook
 *
 * 一般而言，monaco-editor 在项目中使用，必然锁定特定的 locale ，而很少在运行时动态的进行切换
 * 目前 monaco-editor 并不适宜动态切换 locale ，如果必要动态切换，最好请刷新页面
 *
 * 所以这个实现，做成一个独立的 hook 来实现，毕竟这不是一个必要性极高的功能
 *
 * @param ref
 * @param locale
 */
export const useLocaleSwitch = (
  ref: RefObject<MonacoCodeEditorRef | null>,
  locale?: string,
) => {
  const localeRef = useRef(locale);
  const [ticks, setTicks] = useState(0);

  const lastPositionRef = useRef<Position | null>(null);
  const lastScrollRef = useRef<monaco.editor.INewScrollPosition | undefined>(
    undefined,
  );

  useIsomorphicLayoutEffect(() => {
    if (ref.current == null) return;
    const { editorRef, modelRef, assetsIds, inputRef, setReadyState } =
      ref.current;

    if (localeRef.current !== locale) {
      console.log('change locale', locale);
      // biome-ignore lint/complexity/noForEach: <explanation>
      assetsIds.length && assetsIds.forEach((it) => unmountRemote(it));
      // @ts-ignore
      // biome-ignore lint/performance/noDelete: <explanation>
      delete window.monaco;
      //
      inputRef.current.source = editorRef.current?.getValue() || '';
      // editor state mark
      markEditorLastState(editorRef.current);
      modelRef.current?.dispose();
      editorRef.current?.dispose();
      setReadyState(MonacoReadyState.Init);
      localeRef.current = locale;
      setTicks((prev) => prev + 1);
    }
  }, [locale]);

  return {
    localeKey: `locale_${ticks}`,
    markEditorLastState,
    recoveryEditorLastState,
  };

  function markEditorLastState(editor?: monaco.editor.IStandaloneCodeEditor) {
    if (editor == null) return;

    lastPositionRef.current = editor.getPosition();
    lastScrollRef.current = {
      scrollLeft: editor.getScrollLeft(),
      scrollTop: editor.getScrollTop(),
    };
  }

  function recoveryEditorLastState(
    editor?: monaco.editor.IStandaloneCodeEditor,
    delay?: number,
  ) {
    if (editor == null) return;
    const fn = () => {
      if (lastPositionRef.current != null) {
        editor.focus();
        editor.setPosition(lastPositionRef.current);
        lastPositionRef.current = null;
      }
      if (lastScrollRef.current != null) {
        editor.setScrollPosition(lastScrollRef.current);
        lastScrollRef.current = undefined;
      }
    };
    if (isNumber(delay) && delay > 0) {
      setTimeout(fn, delay);
    } else {
      fn();
    }
  }
};
