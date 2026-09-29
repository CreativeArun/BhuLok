if (typeof window !== 'undefined') {
  (window as unknown as { CESIUM_BASE_URL: string }).CESIUM_BASE_URL = '/cesium/';
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
