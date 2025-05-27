import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Route/Routes'; // osobny plik z trasami

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;