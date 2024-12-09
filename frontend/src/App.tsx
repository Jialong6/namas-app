import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Home from '@pages/Home/Home';
import Collections from '@pages/Collections/Collections';
import ProductDetails from '@pages/Details/ProductDetails';
import Profile from '@pages/Profile/Profile';
import MyNavbar from '@components/MyNavbar';
import Footer from '@components/Footer';
import BottomAlert from '@components/BottomAlert';
import Cart from '@components/Cart';
import AuthDialog from '@components/AuthDialog';
import Customize from '@pages/Customize/Customize';
import Checkout from '@pages/Checkout/Checkout';
import CompletePage from '@pages/Checkout/CompletePayment';
import { fetchCsrfToken } from '@services/userService';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    void fetchCsrfToken();
  }, []);

  return (
    <Router>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Route to all collections listing page */}
        <Route path="/collections" element={<Collections />} />
        {/* Route to collections listing filtered by category */}
        <Route path="/collections/:category" element={<Collections />} />
        {/* Route to product details page */}
        <Route path="/details/:id" element={<ProductDetails />} />
        {/* Route to profile page */}
        <Route path="/profile" element={<Profile />} />
        {/* Route to checkout page */}
        <Route path="/checkout" element={<Checkout />} />
        {/* Route to complete payment page */}
        <Route path="/complete" element={<CompletePage />} />
        {/* Route to customization page */}
        <Route path="/customize" element={<Customize />} />
        {/* Redirect to home page if invalid URL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* Components */}
      <Footer />
      <Cart />
      <AuthDialog />
      <BottomAlert />
    </Router>
  );
}

export default App;
