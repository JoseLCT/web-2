import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './pages/App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Equipo from './pages/Equipo.jsx'
import Canal from './pages/Canal.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/equipo/:fk_equipo",
    element: <Equipo/>,
  },
  {
    path: "/canal/:fk_canal",
    element: <Canal/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
