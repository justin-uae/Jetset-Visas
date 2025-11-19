import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navLinkClass = (path: string) =>
        `text-sm font-medium transition-colors ${isActive(path)
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-700 hover:text-primary'
        }`;

    return (
        <nav className="flex items-center space-x-8">
            <Link to="/" className={navLinkClass('/')}>
                Home
            </Link>

            <Link to="/visas" className={navLinkClass('/visas')}>
                All Visas
            </Link>

            <Link to="/about" className={navLinkClass('/about')}>
                About Us
            </Link>

            <Link to="/contact" className={navLinkClass('/contact')}>
                Contact
            </Link>

            <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
                Login
            </Link>

            <Link
                to="/signup"
                className="text-sm font-medium px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
                Sign Up
            </Link>
        </nav>
    );
};

export default Navigation;