import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './redux/store';
import Home from './pages/Home/Home';
import MainLayout from './layouts/Mainlayout';
import VisaListing from './pages/Listing/VisaListing';
import VisaDetail from './pages/Detail/VisaDetail';
import CartPage from './pages/Cart/CartPage';

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
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;