import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiChevronDown, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchVisas, selectAllVisas, selectUniqueCountries, selectVisasLoading } from '../../redux/slices/visaSlice';

const Hero: React.FC = () => {
    const [showLocationSelector, setShowLocationSelector] = useState(false);
    const navigate = useNavigate();
    const selectorRef = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();
    const allVisas = useAppSelector(selectAllVisas);
    const loading = useAppSelector(selectVisasLoading);
    const uniqueCountries = useAppSelector(selectUniqueCountries);

    useEffect(() => {
        dispatch(fetchVisas());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchVisas());
    }, [dispatch]);

    // Build country data from Shopify visas
    const visaCountries = uniqueCountries.map(country => {
        // Find a visa for this country to get the flag
        const VisaData = allVisas.find(v => v.country === country);

        return {
            value: country.toLowerCase().replace(/\s+/g, '-'),
            label: country,
            flag: VisaData?.flag || '🌍',
            gradient: getCountryGradient(country),
            image: VisaData?.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop'
        };
    }).sort((a, b) => a.label.localeCompare(b.label));

    function getCountryGradient(country: string): string {
        const gradients: Record<string, string> = {
            'UAE': 'from-red-500 via-green-500 to-black',
            'Saudi Arabia': 'from-green-600 to-green-400',
            'Oman': 'from-red-600 via-white to-green-600',
            'Bahrain': 'from-red-600 to-white',
            'India': 'from-orange-500 via-white to-green-600',
            'Turkey': 'from-red-600 to-red-500',
            'Thailand': 'from-red-600 via-white to-blue-600',
            'United States': 'from-blue-700 via-white to-red-600',
            'United Kingdom': 'from-blue-800 via-white to-red-700',
            'Canada': 'from-red-600 via-white to-red-600',
            'Australia': 'from-blue-800 to-blue-600',
        };
        return gradients[country] || 'from-blue-500 to-purple-500';
    }

    // const visaCountries = [
    //     {
    //         value: 'uae',
    //         label: 'UAE',
    //         flag: '🇦🇪',
    //         gradient: 'from-red-500 via-green-500 to-black',
    //         image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'saudi',
    //         label: 'Saudi Arabia',
    //         flag: '🇸🇦',
    //         gradient: 'from-green-600 to-green-400',
    //         image: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'oman',
    //         label: 'Oman',
    //         flag: '🇴🇲',
    //         gradient: 'from-red-600 via-white to-green-600',
    //         image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'bahrain',
    //         label: 'Bahrain',
    //         flag: '🇧🇭',
    //         gradient: 'from-red-600 to-white',
    //         image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'india',
    //         label: 'India',
    //         flag: '🇮🇳',
    //         gradient: 'from-orange-500 via-white to-green-600',
    //         image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'turkey',
    //         label: 'Turkey',
    //         flag: '🇹🇷',
    //         gradient: 'from-red-600 to-red-500',
    //         image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'thailand',
    //         label: 'Thailand',
    //         flag: '🇹🇭',
    //         gradient: 'from-red-600 via-white to-blue-600',
    //         image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'schengen',
    //         label: 'Schengen',
    //         flag: '🇪🇺',
    //         gradient: 'from-blue-700 to-yellow-400',
    //         image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'united-states',
    //         label: 'United States',
    //         flag: '🇺🇸',
    //         gradient: 'from-blue-700 via-white to-red-600',
    //         image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'united-kingdom',
    //         label: 'United Kingdom',
    //         flag: '🇬🇧',
    //         gradient: 'from-blue-800 via-white to-red-700',
    //         image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'canada',
    //         label: 'Canada',
    //         flag: '🇨🇦',
    //         gradient: 'from-red-600 via-white to-red-600',
    //         image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=300&h=200&fit=crop'
    //     },
    //     {
    //         value: 'australia',
    //         label: 'Australia',
    //         flag: '🇦🇺',
    //         gradient: 'from-blue-800 to-blue-600',
    //         image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=300&h=200&fit=crop'
    //     },
    // ];

    const handleCountryClick = (countryValue: string) => {
        console.log("countryValue",countryValue);
        
        navigate(`/country/${countryValue}`);
        setShowLocationSelector(false);
    };

    // Close selector when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
                setShowLocationSelector(false);
            }
        };

        if (showLocationSelector) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLocationSelector]);

    return (
        <section
            className="relative min-h-[600px] md:min-h-[700px] bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
            }}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 w-full max-w-6xl mx-auto">
                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
                        MOST POPULAR
                    </h1>
                    <p className="text-xl md:text-2xl text-white mb-2">
                        Visa Services in
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
                        UAE
                    </h2>
                    {/* Loading State */}
                    {loading && (
                        <div className="mb-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            <p className="text-white mt-2">Loading visa destinations...</p>
                        </div>
                    )}

                    {/* View All Button */}
                    <Link
                        to="/visas"
                        className="inline-block px-8 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-all mb-12 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        View All
                    </Link>

                    {/* Location Selector Button */}
                    <div className="max-w-md mx-auto mb-8">
                        <button
                            onClick={() => setShowLocationSelector(!showLocationSelector)}
                            className="w-full flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="flex items-center">
                                <FiMapPin className="text-primary text-xl mr-3" />
                                <span className="text-gray-700 font-semibold">Select Location</span>
                            </div>
                            <FiChevronDown
                                className={`text-gray-600 text-xl transition-transform duration-300 ${showLocationSelector ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Country Cards Grid - Animated Dropdown */}
                    {showLocationSelector && (
                        <div
                            ref={selectorRef}
                            className="animate-slide-down"
                        >
                            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 max-w-5xl mx-auto border border-white/20">
                                {/* Close Button */}
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                        <FiMapPin className="text-primary mr-2" />
                                        Choose Your Destination
                                    </h3>
                                    <button
                                        onClick={() => setShowLocationSelector(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <FiX className="text-gray-600 text-xl" />
                                    </button>
                                </div>

                                {/* Country Cards Grid */}
                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                        <p className="text-gray-600 mt-4">Loading destinations...</p>
                                    </div>
                                ) : visaCountries.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-600">No destinations available at the moment.</p>
                                    </div>
                                ) :
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                                        {visaCountries.map((country, index) => (
                                            <button
                                                key={country.value}
                                                onClick={() => handleCountryClick(country.value)}
                                                className="group relative overflow-hidden"
                                                style={{
                                                    animationDelay: `${index * 50}ms`,
                                                    animation: 'fadeInUp 0.5s ease-out forwards',
                                                    opacity: 0
                                                }}
                                            >
                                                <div className="relative flex flex-col items-center justify-between h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 border-2 border-gray-100 hover:border-primary overflow-hidden">

                                                    {/* Flag Background Image - Increased visibility */}
                                                    <div className="absolute inset-0 opacity-60 group-hover:opacity-60 transition-opacity duration-500">
                                                        <img
                                                            src={country.image}
                                                            loading='lazy'
                                                            alt={country.label}
                                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                        {/* Overlay to make flag/text visible */}
                                                        {/* <div className="absolute inset-0 bg-white/40 group-hover:bg-white/20 transition-colors duration-500"></div> */}
                                                    </div>

                                                    {/* Gradient Flag Colors Overlay */}
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${country.gradient} opacity-10 group-hover:opacity-25 transition-opacity duration-500`}></div>

                                                    {/* Top Section - Flag Circle */}
                                                    <div className="relative z-10 w-full pt-4 pb-2 px-4">
                                                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-gray-200 group-hover:border-primary transform group-hover:rotate-12 group-hover:scale-110">
                                                            <span className="text-3xl md:text-4xl transform group-hover:scale-110 transition-transform duration-300">
                                                                {country.flag}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Bottom Section - Country Name */}
                                                    <div className="relative z-10 w-full pb-4 px-3">
                                                        <div className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-primary text-center transition-colors duration-300 leading-tight drop-shadow-sm">
                                                            {country.label}
                                                        </div>

                                                        {/* Decorative Line */}
                                                        <div className="mt-2 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-primary to-transparent mx-auto transition-all duration-500"></div>
                                                    </div>

                                                    {/* Shine Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>

                                                    {/* Corner Accent */}
                                                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-primary border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                }

                                {/* Bottom Text */}
                                {!loading && visaCountries.length > 0 && (
                                    <p className="text-center text-sm text-gray-600 mt-6">
                                        Click on any country to explore available visa options
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Overlay when selector is open */}
                    {showLocationSelector && (
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                            onClick={() => setShowLocationSelector(false)}
                        ></div>
                    )}
                </div>
            </div>

            {/* Add custom animations */}
            <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }

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
          animation: fade-in 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
        </section>
    );
};

export default Hero;