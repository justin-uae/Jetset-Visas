import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

interface CategoryCardProps {
    title: string;
    description: string;
    icon: string;
    route: string;
    color: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, icon, route, color }) => {
    return (
        <Link
            to={route}
            className={`block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group`}
        >
            <div className={`${color} p-6 text-center`}>
                <div className="text-6xl mb-2">{icon}</div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <div className="flex items-center text-primary font-semibold group-hover:text-accent transition-colors">
                    <span>Explore Visas</span>
                    <FiArrowRight className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                </div>
            </div>
        </Link>
    );
};

const Categories: React.FC = () => {
    const categories = [
        {
            title: 'UAE Visas',
            description: 'Tourist, transit, and multiple entry visas for the UAE with fast processing',
            icon: '🇦🇪',
            route: '/category/uae',
            color: 'bg-gradient-to-br from-red-50 to-green-50',
        },
        {
            title: 'Saudi Arabia Visas',
            description: 'Tourist, business, and Umrah visas for Saudi Arabia',
            icon: '🇸🇦',
            route: '/category/saudi',
            color: 'bg-gradient-to-br from-green-50 to-emerald-50',
        },
        {
            title: 'Oman Visas',
            description: 'Tourist visas for Oman with quick processing times',
            icon: '🇴🇲',
            route: '/category/oman',
            color: 'bg-gradient-to-br from-red-50 to-orange-50',
        },
        {
            title: 'Bahrain Visas',
            description: 'Tourist and sponsored visas for Bahrain',
            icon: '🇧🇭',
            route: '/category/bahrain',
            color: 'bg-gradient-to-br from-red-50 to-pink-50',
        },
        {
            title: 'Global Visas',
            description: 'Visas for 40+ countries including USA, UK, Schengen, and more',
            icon: '🌍',
            route: '/category/global',
            color: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Browse Visas by Category
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose from our wide range of visa services for GCC countries and international destinations
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {categories.slice(0, 4).map((category, index) => (
                        <CategoryCard key={index} {...category} />
                    ))}

                    {/* Global Visas - Full Width */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <CategoryCard {...categories[4]} />
                    </div>
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/visas"
                        className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg"
                    >
                        View All Visas
                        <FiArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Categories;