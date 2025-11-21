import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../pages/Home/Footer';
import { useAppDispatch } from '../redux/hooks';
import { fetchExchangeRates } from '../redux/slices/currencySlice';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        // Fetch exchange rates on app load
        dispatch(fetchExchangeRates());

        // Refresh rates every 1 hour
        const interval = setInterval(() => {
            dispatch(fetchExchangeRates());
        }, 60 * 60 * 1000); // 1 hour

        return () => clearInterval(interval);
    }, [dispatch]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayout;