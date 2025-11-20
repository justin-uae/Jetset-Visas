import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './redux/store';
import Home from './pages/Home/Home';
import MainLayout from './layouts/Mainlayout';
import VisaListing from './pages/Listing/VisaListing';
import VisaDetail from './pages/Detail/VisaDetail';
import CartPage from './pages/Cart/CartPage';
import AboutUs from './pages/AboutUs/About';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ContactPage from './pages/Contact/Contact';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visas" element={<VisaListing />} />
            <Route path="/category/:category" element={<VisaListing />} />
            <Route path="/country/:country" element={<VisaListing />} />
            <Route path="/visas/:handle" element={<VisaDetail />} />
            <Route path="/category/:category" element={<VisaListing />} />
            <Route path="/country/:country" element={<VisaListing />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;