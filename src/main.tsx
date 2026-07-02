import { createRoot } from 'react-dom/client'
import '@fontsource/archivo/latin-400.css'
import '@fontsource/archivo/latin-500.css'
import '@fontsource/archivo/latin-700.css'
import '@fontsource/archivo/latin-900.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import '@fontsource/ibm-plex-mono/latin-600.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <App />,
)
