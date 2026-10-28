import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Global fetch wrapper: supports optional VITE_API_URL and local dev retry
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [input, init] = args;

  // If external API URL configured via VITE_API_URL, prepend it
  if (API_BASE && typeof input === 'string' && (input.startsWith('/api') || input.startsWith('/uploads'))) {
    input = `${API_BASE}${input}`;
  }

  try {
    return await originalFetch(input, init);
  } catch (err) {
    const isLocal = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (
      isLocal &&
      typeof input === 'string' &&
      (input.startsWith('/api') || input.startsWith('/uploads')) &&
      window.location.port !== '5000'
    ) {
      const backendUrl = `http://localhost:5000${input}`;
      return await originalFetch(backendUrl, init);
    }
    throw err;
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
