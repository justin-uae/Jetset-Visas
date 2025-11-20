import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiDollarSign } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchVisas, selectAllVisas, selectVisasLoading } from '../../redux/slices/visaSlice';
import type { VisaProduct } from '../../types/visa-types';

interface VisaCardProps {
    title: string;
    country: string;
    duration: string;
    price: number;
    image: string;
    handle: string;
    flag: string;
    isGCC?: Boolean;
}

const VisaCard: React.FC<VisaCardProps> = ({ title, duration, price, image, handle, flag, isGCC }) => {
    return (
        <Link
            to={`/visas/${handle}`}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    loading='lazy'
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 z-10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center border-2 border-white/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <span className="text-2xl sm:text-3xl md:text-3xl">
                            {flag}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                        <FiClock className="mr-2 text-primary" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <FiDollarSign className="mr-2 text-primary" />
                        <span className="font-semibold text-primary">AED {price}</span>
                    </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                    <span className="text-sm text-accent font-medium group-hover:text-primary transition-colors">
                        {isGCC ? `Apply Now →` : `Enquire Now`}
                    </span>
                </div>
            </div>
        </Link>
    );
};

const FeaturedVisasSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'popular' | 'featured'>('popular');
    const dispatch = useAppDispatch();
    const allVisas = useAppSelector(selectAllVisas);
    const loading = useAppSelector(selectVisasLoading);

    useEffect(() => {
        dispatch(fetchVisas());
    }, [dispatch]);

    // Get popular visas (lowest price, most common durations)
    const popularVisas = React.useMemo(() => {
        return [...allVisas]
            .filter(visa => {
                // Filter for common tourist visa types
                const isPopular =
                    visa.category.toLowerCase().includes('tourist') ||
                    visa.entryType.toLowerCase().includes('single');
                return isPopular;
            })
            .sort((a, b) => a.price - b.price) // Sort by price (cheapest first)
            .slice(0, 8); // Get top 8
    }, [allVisas]);

    // Get featured visas (multiple entry, longer duration, or special categories)
    const featuredVisas = React.useMemo(() => {
        return [...allVisas]
            .filter(visa => {
                const isFeatured =
                    visa.entryType.toLowerCase().includes('multiple') ||
                    visa.duration.includes('Year') ||
                    visa.category.toLowerCase().includes('business') ||
                    parseInt(visa.duration) >= 60;
                return isFeatured;
            })
            .sort((a, b) => b.price - a.price) // Sort by price (premium first)
            .slice(0, 8);
    }, [allVisas]);

    const displayVisas = activeTab === 'popular' ? popularVisas : featuredVisas;

    // Transform visa data for card
    const transformVisaForCard = (visa: VisaProduct): VisaCardProps => ({
        title: visa.title,
        country: visa.country,
        duration: visa.duration,
        price: visa.price,
        image: visa.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500',
        handle: visa.handle,
        flag: visa.flag,
        isGCC: visa.isGCC,
    });

    return (
        <section className="py-12 md:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-white rounded-lg shadow-md p-1">
                        <button
                            onClick={() => setActiveTab('popular')}
                            className={`px-6 py-3 rounded-md font-semibold transition-all ${activeTab === 'popular'
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:text-primary'
                                }`}
                        >
                            Popular Visas
                        </button>
                        <button
                            onClick={() => setActiveTab('featured')}
                            className={`px-6 py-3 rounded-md font-semibold transition-all ${activeTab === 'featured'
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:text-primary'
                                }`}
                        >
                            Featured Visas
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="text-gray-600 mt-4">Loading visas...</p>
                        </div>
                    </div>
                ) : displayVisas.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600 mb-4">
                            No {activeTab} visas available at the moment.
                        </p>
                        <Link
                            to="/visas"
                            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                        >
                            Browse All Visas
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Visa Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displayVisas.slice(0, 4).map((visa) => (
                                <VisaCard key={visa.id} {...transformVisaForCard(visa)} />
                            ))}
                        </div>

                        {/* Show More Visas if available */}
                        {displayVisas.length > 4 && (
                            <div className="mt-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {displayVisas.slice(4, 8).map((visa) => (
                                        <VisaCard key={visa.id} {...transformVisaForCard(visa)} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* View All Button */}
                        <div className="text-center mt-10">
                            <Link
                                to="/visas"
                                className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg"
                            >
                                View All {allVisas.length} Visas
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default FeaturedVisasSection;