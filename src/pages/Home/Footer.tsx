import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone } from 'react-icons/fi';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer - Single Line Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">

                    {/* Logo & Description */}
                    <div className="flex-shrink-0 lg:max-w-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <img
                                src="/favicon.png"
                                loading='lazy'
                                alt="JetSet Logo"
                                className="h-8 w-auto"
                            />

                            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                                JETSET <span className="text-accent">VISAS</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed hidden lg:block">
                            Fast, reliable visa processing for UAE and 40+ countries worldwide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <Link to="/" className="hover:text-accent transition-colors whitespace-nowrap">
                            Home
                        </Link>
                        <Link to="/visas" className="hover:text-accent transition-colors whitespace-nowrap">
                            All Visas
                        </Link>
                        <Link to="/about" className="hover:text-accent transition-colors whitespace-nowrap">
                            About Us
                        </Link>
                        {/* <Link to="/contact" className="hover:text-accent transition-colors whitespace-nowrap">
                            Contact
                        </Link> */}
                    </nav>

                    {/* Contact Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <a
                            href="tel:+971545672633"
                            className="flex items-center hover:text-accent transition-colors whitespace-nowrap"
                        >
                            <FiPhone className="mr-1.5 text-accent" size={16} />
                            <span>+971 54 567 2633</span>
                        </a>
                        <a
                            href="mailto:info@jetsetvisas.ae"
                            className="flex items-center hover:text-accent transition-colors"
                        >
                            <FiMail className="mr-1.5 text-accent" size={16} />
                            <span>info@jetsetvisas.ae</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
                        <div className="text-center md:text-left">
                            © {currentYear} Jetsetvisas.ae is a trading style of Jetset Worldwide Travel & Tourism. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;