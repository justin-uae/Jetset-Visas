import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiPhone, FiMail } from 'react-icons/fi';
import { selectCartItemCount } from '../redux/slices/cartSlice';
import { useAppSelector } from '../redux/hooks';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import { CurrencySwitcher } from './CurrencySwitcher';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const cartItemCount = useAppSelector(selectCartItemCount);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            {/* Top Bar - Contact Info */}
            <div className="bg-primary text-white py-2 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-6">
                            <a
                                href="tel:+97154567263"
                                className="flex items-center hover:text-accent transition-colors"
                            >
                                <FiPhone className="mr-2" />
                                +971 54 567 2633
                            </a>
                            <a
                                href="mailto:info@jetsetvisas.ae"
                                className="flex items-center hover:text-accent transition-colors"
                            >
                                <FiMail className="mr-2" />
                                info@jetsetvisas.ae
                            </a>
                        </div>
                        <div className="text-sm">
                            <span className="font-semibold">Fast & Reliable Visa Processing</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo with Text */}
                    <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                        {/* Logo Image */}
                        <LazyLoadImage
                            src="/favicon.png"
                            alt="JetSet Logo"
                            loading='lazy'
                            className="h-8 sm:h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Visas Text */}
                        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                            JETSET <span className="text-accent">VISAS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <Navigation />
                    </div>

                    {/* Cart, Currency & Mobile Menu Button */}
                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                        {/* Currency Switcher - Hidden on smallest screens */}
                        <div className="hidden sm:block">
                            <CurrencySwitcher />
                        </div>

                        {/* Divider - Hidden on smallest screens */}
                        <div className="hidden sm:block border-r border-gray-200 h-6"></div>

                        {/* Cart Button */}
                        <Link
                            to="/cart"
                            className="relative p-2 text-gray-700 hover:text-primary transition-colors"
                        >
                            <FiShoppingCart className="text-xl sm:text-2xl" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="text-xl sm:text-2xl" />
                            ) : (
                                <FiMenu className="text-xl sm:text-2xl" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </header>
    );
};

export default Header;