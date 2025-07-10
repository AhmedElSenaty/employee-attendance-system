import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// console.log = () => {} // Disable console logs in production
console.warn = () => {} // Disable console warnings in production
console.error = () => {} // Disable console errors in production

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
)
