import React from 'react';
import { Link } from 'react-router-dom';
import { CurrencySwitcher } from './CurrencySwitcher';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="lg:hidden border-t border-gray-200">
            <div className="px-4 py-4 space-y-3 bg-white">
                {/* Currency Switcher - Mobile Only */}
                <div className="sm:hidden pb-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Currency</span>
                        <CurrencySwitcher />
                    </div>
                </div>

                {/* Home */}
                <Link
                    to="/"
                    className="block py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={onClose}
                >
                    Home
                </Link>

                {/* All Visas */}
                <Link
                    to="/visas"
                    className="block py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={onClose}
                >
                    All Visas
                </Link>

                {/* About */}
                <Link
                    to="/about"
                    className="block py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={onClose}
                >
                    About Us
                </Link>

                {/* Contact */}
                <Link
                    to="/contact"
                    className="block py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={onClose}
                >
                    Contact
                </Link>

                {/* Login */}
                <Link
                    to="/login"
                    className="block py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={onClose}
                >
                    Login
                </Link>

                {/* Sign Up */}
                <Link
                    to="/signup"
                    className="block py-3 text-center bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    onClick={onClose}
                >
                    Sign Up
                </Link>

                {/* Contact Info */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Contact Us</p>
                    <div className="space-y-2 text-sm text-gray-600">
                        <a
                            href="tel:+97154567263"
                            className="block hover:text-primary transition-colors"
                        >
                            📞 +971 54 567 2633
                        </a>
                        <a
                            href="mailto:info@jetsetvisas.ae"
                            className="block hover:text-primary transition-colors"
                        >
                            ✉️ info@jetsetvisas.ae
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;