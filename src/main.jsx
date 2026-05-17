import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { DispatchProvider } from './context/DispatchContext.jsx';
import './assets/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DispatchProvider>
      <App />
    </DispatchProvider>
  </React.StrictMode>
);