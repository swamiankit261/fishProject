import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import Home from './pages/Home.jsx';
import Collection from './pages/Collection.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import PlaceOrder from './pages/PlaceOrder.jsx';
import Orders from './pages/Orders.jsx';
import PrivateRoutes from './pages/auth/PrivateRoutes.jsx';
import List from './admin/pages/List.jsx';
import Add from './admin/Add.jsx';
import OrderList from "./admin/pages/OrderList.jsx"
import { ThemeProvider } from "@material-tailwind/react";
import Profile from './pages/Profile.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path='/' element={<Home />} />
      <Route path='/collection' element={<Collection />} />
      <Route element={<PrivateRoutes />} >
        <Route path='/cart' element={<Cart />} />
        <Route path='/admin/add/:Id' element={<Add />} />
        <Route path='/admin/add' element={<Add />} />
        <Route path='/admin/orderslist' element={<OrderList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/place-order' element={<PlaceOrder />} />
      </Route>
      <Route element={<PrivateRoutes />} >
        <Route path='/admin' element={<List />} />
      </Route>
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/product/:productId' element={<Product />} />
      <Route path='/login' element={<Login />} />
      <Route path="*" element={<div className='text-3xl font-serif font-semibold text-center animate-bounce'>Page not found...</div>} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ThemeProvider>
)
