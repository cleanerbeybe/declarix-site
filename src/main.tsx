import { createRoot } from 'react-dom/client'
// Fonts are self-hosted from /public/fonts with font-display: optional (v3.0 §4.3 — no FOUC);
// @font-face declarations live in index.css, critical weights preloaded from index.html.
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <App />,
)
