import { createRoot } from 'react-dom/client';
import './global.css';
import App from './App';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App/>);
}
