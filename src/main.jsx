import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Make sure this contains the Tailwind directives

// When deployed, send requests written for the local backend (http://127.0.0.1:8000)
// to the online backend in VITE_API_URL instead. On your laptop nothing changes.
const LOCAL_API = 'http://127.0.0.1:8000';
const LIVE_API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

if (LIVE_API && LIVE_API !== LOCAL_API) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith(LOCAL_API)) {
      input = LIVE_API + input.slice(LOCAL_API.length);
    } else if (input instanceof URL && input.href.startsWith(LOCAL_API)) {
      input = LIVE_API + input.href.slice(LOCAL_API.length);
    } else if (input instanceof Request && input.url.startsWith(LOCAL_API)) {
      input = new Request(LIVE_API + input.url.slice(LOCAL_API.length), input);
    }
    return originalFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);