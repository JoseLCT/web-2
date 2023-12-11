import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/home/Home';
import Maps from './pages/maps/Maps';
import 'material-icons/iconfont/material-icons.css';
import Filtered from './pages/filtered/Filtered';
import Detail from './pages/detail/Detail';
import Checkout from './pages/checkout/Checkout';
import User from './pages/user/User';
import Form from './pages/form/Form';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/maps",
    element: <Maps />,
  },
  {
    path: "/filtered",
    element: <Filtered />,
  },
  {
    path: "/accommodation/:id",
    element: <Detail />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/form",
    element: <Form />,
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)