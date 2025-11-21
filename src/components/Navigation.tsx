import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleLogout = async () => {
        await dispatch(logout());
        setShowDropdown(false);
        navigate('/login');
    };

    return (
        <nav className="flex items-center space-x-8">
            <Link
                to="/"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
                Home
            </Link>
            <Link
                to="/visas"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
                All Visas
            </Link>
            <Link
                to="/about"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
                About
            </Link>
            <Link
                to="/contact"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
                Contact
            </Link>

            {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 text-gray-700 hover:text-primary font-medium transition-colors"
                    >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <FiUser className="text-primary" size={16} />
                        </div>
                        <span className="hidden xl:inline">{user?.firstName || 'Account'}</span>
                        <FiChevronDown
                            className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                            size={16}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                            </div>

                            {/* Menu Items */}
                            <Link
                                to="/profile"
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FiUser size={16} />
                                <span>My Profile</span>
                            </Link>

                            {/* <Link
                                to="/profile"
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FiPackage size={16} />
                                <span>My Bookings</span>
                            </Link> */}

                            <div className="border-t border-gray-100 my-1"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <FiLogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link
                    to="/login"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary font-medium transition-colors"
                >
                    <FiUser size={18} />
                    <span>Login</span>
                </Link>
            )}

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </nav>
    );
};

export default Navigation;