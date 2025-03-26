import { css } from '@emotion/css';
import {
  MonacoCodeEditor,
  type MonacoCodeEditorProps,
  type MonacoCodeEditorRef,
  MonacoProvider,
} from '@react-monaco/core';
import { TextmateInjection } from '@react-monaco/plugin-textmate';
import { useRef } from 'react';

const baseUrl = 'https://static.summererp.com/misc/monaco-editor/0.52.2/';

const editorOptions: MonacoCodeEditorProps['options'] = {
  lineHeight: 1.5,
  tabSize: 2,
  fontSize: 14,
  fontWeight: '300',
  fontFamily: 'var(--font-mono)',
  fontLigatures: 'no-common-ligatures, slashed-zero',
  letterSpacing: 0.025,
  minimap: { enabled: false },
  theme: 'vs',
  scrollbar: {
    verticalHasArrows: false,
    horizontalHasArrows: false,
    vertical: 'visible',
    horizontal: 'visible',
    verticalScrollbarSize: 13,
    horizontalScrollbarSize: 13,
    verticalSliderSize: 8,
    horizontalSliderSize: 8,
  },
};

const cssScrollBar = css`
  .scrollbar.vertical {
    padding-top: 2px;
    .slider {
      margin-left: 1px;
      border-radius: 10px;
    }
  }
`;

const App = () => {
  const ref = useRef<MonacoCodeEditorRef | null>(null);
  return (
    <>
      <MonacoProvider loader={{ baseUrl }}>
        <TextmateInjection onChange={(active) => console.log(active)} />
        <MonacoCodeEditor
          ref={ref}
          input={{
            filename: 'hello_world.ts',
            source: new Array(100).fill('console.log("00abc");').join('\n'),
          }}
          className={cssScrollBar}
          options={editorOptions}
        />
      </MonacoProvider>
    </>
  );
};

export default App;
