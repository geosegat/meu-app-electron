import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'remixicon/fonts/remixicon.css';
import './index.css';

const hideLoader = () => {
  const loader = document.getElementById('app-loader');
  const root = document.getElementById('root');

  if (loader && root) {
    loader.classList.add('loaded');
    root.classList.add('loaded');

    setTimeout(() => {
      loader.remove();
    }, 300);
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

setTimeout(hideLoader, 100);

window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
