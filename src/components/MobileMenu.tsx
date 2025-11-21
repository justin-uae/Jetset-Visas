import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiGlobe, FiInfo, FiMail, FiUser, FiLogIn, FiUserPlus, FiPhone } from 'react-icons/fi';
import { CurrencySwitcher } from './CurrencySwitcher';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogout = async () => {
        await dispatch(logout());
        onClose();
        navigate('/login');
    };

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

                {/* User Profile Section - If Authenticated */}
                {isAuthenticated && user && (
                    <div className="pb-3 border-b border-gray-200 bg-primary/5 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                <FiUser className="text-primary" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <Link
                    to="/"
                    className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={onClose}
                >
                    <FiHome size={18} />
                    <span>Home</span>
                </Link>

                <Link
                    to="/visas"
                    className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={onClose}
                >
                    <FiGlobe size={18} />
                    <span>All Visas</span>
                </Link>

                <Link
                    to="/about"
                    className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={onClose}
                >
                    <FiInfo size={18} />
                    <span>About Us</span>
                </Link>

                <Link
                    to="/contact"
                    className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={onClose}
                >
                    <FiMail size={18} />
                    <span>Contact</span>
                </Link>

                {/* Profile or Login/Signup */}
                {isAuthenticated ? (
                    <>
                        <Link
                            to="/profile"
                            className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                            onClick={onClose}
                        >
                            <FiUser size={18} />
                            <span>My Account</span>
                        </Link>
                        
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 py-3 text-red-600 hover:bg-red-50 font-medium transition-colors w-full rounded-lg px-2"
                        >
                            <FiLogIn size={18} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 py-3 text-primary border-2 border-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
                            onClick={onClose}
                        >
                            <FiLogIn size={18} />
                            <span>Login</span>
                        </Link>

                        <Link
                            to="/signup"
                            className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            onClick={onClose}
                        >
                            <FiUserPlus size={18} />
                            <span>Sign Up</span>
                        </Link>
                    </>
                )}

                {/* Contact Info */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Contact Us</p>
                    <div className="space-y-2">
                        <a 
                            href="tel:+97154567263" 
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                        >
                            <FiPhone size={16} />
                            <span>+971 54 567 2633</span>
                        </a>
                        <a 
                            href="mailto:info@jetsetvisas.ae" 
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                        >
                            <FiMail size={16} />
                            <span>info@jetsetvisas.ae</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;