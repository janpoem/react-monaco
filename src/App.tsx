import { HashRouter, Route, Routes } from 'react-router';
import { CodeEditorSample, ThemeConverter } from './samples';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<CodeEditorSample />} />
        <Route path={'/theme-converter'} element={<ThemeConverter />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
