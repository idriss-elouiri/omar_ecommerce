import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import CreateProduct from './pages/CreateProduct';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import UpdatedProduct from './pages/UpdateProduct';
import ProductDetails from './pages/ProductDetails';
import Header from './components/Header';
import ProductPage from './pages/ProductPage';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Order from './pages/Order';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/register' element={<Register />} />
        <Route path='/log-in' element={<Login />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-product' element={<CreateProduct />} />
          <Route path='/update-product/:productId' element={<UpdatedProduct />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route path='/product-details/:productSlug' element={<ProductDetails />} />
        <Route path='/product-page' element={<ProductPage />} />
        <Route path='/search' element={<Search />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order/:id' element={<Order />} />
      </Routes>
    </BrowserRouter>
  );
}