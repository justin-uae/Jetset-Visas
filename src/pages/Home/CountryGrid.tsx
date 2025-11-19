import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

interface CountryCardProps {
    country: string;
    label: string;
    flag: string;
    visaCount: number;
    startingPrice: number;
}

const CountryCard: React.FC<CountryCardProps> = ({ country, label, flag, visaCount, startingPrice }) => {
    return (
        <Link
            to={`/country/${country.toLowerCase()}`}
            className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        >
            <div className="relative h-40 bg-gradient-to-br from-primary to-secondary overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl opacity-30 transform group-hover:scale-110 transition-transform duration-300">
                        {flag}
                    </span>
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {label}
                </h3>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{visaCount} visa{visaCount > 1 ? 's' : ''}</span>
                    <span className="text-primary font-semibold">From AED {startingPrice}</span>
                </div>
                <div className="mt-3 flex items-center text-accent font-medium text-sm group-hover:text-primary transition-colors">
                    <span>View Visas</span>
                    <FiArrowRight className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
};

const CountryGrid: React.FC = () => {
    const popularCountries = [
        { country: 'INDIA', label: 'India', flag: '🇮🇳', visaCount: 5, startingPrice: 160 },
        { country: 'TURKEY', label: 'Turkey', flag: '🇹🇷', visaCount: 2, startingPrice: 250 },
        { country: 'THAILAND', label: 'Thailand', flag: '🇹🇭', visaCount: 1, startingPrice: 550 },
        { country: 'SCHENGEN', label: 'Schengen', flag: '🇪🇺', visaCount: 1, startingPrice: 360 },
        { country: 'MALAYSIA', label: 'Malaysia', flag: '🇲🇾', visaCount: 2, startingPrice: 50 },
        { country: 'SINGAPORE', label: 'Singapore', flag: '🇸🇬', visaCount: 1, startingPrice: 250 },
        { country: 'EGYPT', label: 'Egypt', flag: '🇪🇬', visaCount: 1, startingPrice: 200 },
        { country: 'VIETNAM', label: 'Vietnam', flag: '🇻🇳', visaCount: 1, startingPrice: 180 },
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Popular Destinations
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore visa options for the most popular travel destinations
                    </p>
                </div>

                {/* Country Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {popularCountries.map((country, index) => (
                        <CountryCard key={index} {...country} />
                    ))}
                </div>

                {/* View More */}
                <div className="text-center mt-12">
                    <Link
                        to="/category/global"
                        className="inline-flex items-center text-primary font-semibold hover:text-accent transition-colors"
                    >
                        View All 40+ Countries
                        <FiArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CountryGrid;