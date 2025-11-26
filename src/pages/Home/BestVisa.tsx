import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchVisas, selectAllVisas, selectVisasLoading } from '../../redux/slices/visaSlice';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface CityCardProps {
    name: string;
    image: string;
    country: string;
    route: string;
    flag: string;
    visaCount: number;
}

const CityCard: React.FC<CityCardProps> = ({ name, image, route }) => {
    return (
        <Link
            to={route}
            className="flex-shrink-0 w-40 sm:w-44 md:w-52 lg:w-56 group cursor-pointer"
        >
            <div className="relative h-40 sm:h-44 md:h-52 lg:h-56 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Background Image */}
                <LazyLoadImage
                    src={image}
                    loading='lazy'
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                {/* Dark gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Glassmorphism Country Name - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 sm:px-4 sm:py-3 border border-white/20 shadow-2xl group-hover:bg-white/20 transition-all duration-300">
                        <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
                            {name}
                        </h3>
                    </div>
                </div>

                {/* Hover Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>
            </div>
        </Link>
    );
};
const BestVisa: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const allVisas = useAppSelector(selectAllVisas);
    const loading = useAppSelector(selectVisasLoading);

    useEffect(() => {
        dispatch(fetchVisas());
    }, [dispatch]);

    // Group visas by country and get unique countries with their data
    const countryData = React.useMemo(() => {
        const grouped = allVisas.reduce((acc, visa) => {
            if (!acc[visa.country]) {
                acc[visa.country] = {
                    country: visa.country,
                    flag: visa.flag,
                    image: visa.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500',
                    visaCount: 0,
                    route: `/country/${visa.country.toLowerCase().replace(/\s+/g, '-')}`
                };
            }
            acc[visa.country].visaCount++;
            return acc;
        }, {} as Record<string, any>);

        // Convert to array and sort by visa count (most popular first)
        return Object.values(grouped)
            .sort((a: any, b: any) => b.visaCount - a.visaCount)
            .slice(0, 12); // Show top 12 destinations
    }, [allVisas]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft =
                direction === 'left'
                    ? scrollContainerRef.current.scrollLeft - scrollAmount
                    : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Best Visa Destinations
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Explore our most popular destinations
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                            aria-label="Scroll left"
                        >
                            <FiChevronLeft className="text-xl" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                            aria-label="Scroll right"
                        >
                            <FiChevronRight className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-56">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="text-gray-600 mt-4">Loading destinations...</p>
                        </div>
                    </div>
                ) : countryData.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No visa destinations available at the moment.</p>
                        <Link
                            to="/visas"
                            className="inline-block mt-4 text-primary hover:text-accent font-semibold"
                        >
                            Browse All Visas →
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Scrollable Cities Grid */}
                        <div
                            ref={scrollContainerRef}
                            className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {countryData.map((destination: any, index: number) => (
                                <CityCard
                                    key={index}
                                    name={destination.country}
                                    image={destination.image}
                                    country={destination.country}
                                    route={destination.route}
                                    flag={destination.flag}
                                    visaCount={destination.visaCount}
                                />
                            ))}
                        </div>

                        {/* View All Link */}
                        <div className="text-center mt-8">
                            <Link
                                to="/visas"
                                className="text-primary hover:text-accent font-semibold inline-flex items-center"
                            >
                                View All Destinations
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default BestVisa;