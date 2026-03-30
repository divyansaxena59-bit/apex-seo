import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClientRouter } from '@react-router/react';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <ClientRouter />
  </React.StrictMode>
);
