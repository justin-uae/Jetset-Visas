import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiChevronDown, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchVisas, selectAllVisas, selectVisasLoading } from '../../redux/slices/visaSlice';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Hero: React.FC = () => {
    const [showSelector, setShowSelector] = useState(false);
    const selectorRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const allVisas = useAppSelector(selectAllVisas);
    const loading = useAppSelector(selectVisasLoading);

    useEffect(() => {
        dispatch(fetchVisas());
    }, [dispatch]);

    // Filter GCC countries only and get unique countries
    const gccCountries = React.useMemo(() => {
        const uniqueCountries = new Map<string, { label: string; value: string; image: string }>();

        allVisas
            .filter(visa => visa.isGCC) // Only GCC visas
            .forEach(visa => {
                if (!uniqueCountries.has(visa.country)) {
                    uniqueCountries.set(visa.country, {
                        label: visa.country,
                        value: visa.country.toLowerCase().replace(/\s+/g, '-'),
                        image: visa.images[0] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop&q=80'
                    });
                }
            });

        return Array.from(uniqueCountries.values()).sort((a, b) => a.label.localeCompare(b.label));
    }, [allVisas]);

    const handleCountryClick = (value: string) => {
        setShowSelector(false);
        navigate(`/country/${value}`);
    };

    // Close on outside click
    useEffect(() => {
        if (!showSelector) return;

        const handleClick = (e: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
                setShowSelector(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.body.style.overflow = 'unset';
        };
    }, [showSelector]);

    return (
        <section className="relative">
            {/* Hero Section */}
            <div
                className="relative min-h-[600px] md:min-h-[700px] bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4 w-full max-w-6xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            MOST POPULAR
                        </h1>
                        <p className="text-xl md:text-2xl text-white mb-2">Visa Services in</p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">UAE</h2>

                        {loading && (
                            <div className="mb-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        )}

                        <Link
                            to="/visas"
                            className="inline-block px-8 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-all mb-12 shadow-lg transform hover:scale-105"
                        >
                            View All
                        </Link>

                        <div className="max-w-md mx-auto mb-8">
                            <button
                                onClick={() => setShowSelector(!showSelector)}
                                className="w-full flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-center">
                                    <FiMapPin className="text-primary text-xl mr-3" />
                                    <span className="text-gray-700 font-semibold">Select Location</span>
                                </div>
                                <FiChevronDown
                                    className={`text-gray-600 text-xl transition-transform duration-300 ${showSelector ? 'rotate-180' : ''}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal - Centered */}
            {showSelector && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setShowSelector(false)}
                    />

                    {/* Modal Content - Centered Vertically & Horizontally */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div ref={selectorRef} className="w-full max-w-6xl my-8 animate-scale-up">
                            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
                                        <FiMapPin className="text-primary mr-2" />
                                        Choose Destination
                                    </h3>
                                    <button
                                        onClick={() => setShowSelector(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Close"
                                    >
                                        <FiX className="text-gray-600 text-xl" />
                                    </button>
                                </div>

                                {/* Grid */}
                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                        <p className="text-gray-600 mt-4">Loading destinations...</p>
                                    </div>
                                ) : gccCountries.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-600">No destinations available.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                                        {gccCountries.map((country, i) => (
                                            <button
                                                key={country.value}
                                                onClick={() => handleCountryClick(country.value)}
                                                className="group relative animate-fade-up"
                                                style={{ animationDelay: `${i * 30}ms` }}
                                            >
                                                <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-primary overflow-hidden">
                                                    <div className="relative h-32 sm:h-36 overflow-hidden">
                                                        <LazyLoadImage
                                                            src={country.image}
                                                            alt={country.label}
                                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop&q=80';
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                        <h4 className="text-white font-bold text-sm sm:text-base text-center leading-tight group-hover:scale-105 transition-transform duration-300">
                                                            {country.label}
                                                        </h4>
                                                    </div>
                                                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[15px] border-r-[15px] border-t-primary border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {!loading && gccCountries.length > 0 && (
                                    <p className="text-center text-xs sm:text-sm text-gray-600 mt-6">
                                        Please visit visa page to explore more visa options
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes scale-up {
                    from { 
                        opacity: 0; 
                        transform: scale(0.9);
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1);
                    }
                }
                .animate-scale-up { 
                    animation: scale-up 0.3s ease-out; 
                }
                
                @keyframes fade-up {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px) scale(0.95); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }
                .animate-fade-up { 
                    animation: fade-up 0.4s ease-out forwards; 
                    opacity: 0; 
                }
            `}</style>
        </section>
    );
};

export default Hero;