import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiGrid, FiList, FiTrendingUp, FiSearch, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    fetchVisas,
    selectAllVisas,
    selectVisasLoading
} from '../../redux/slices/visaSlice';
import FilterSidebar from './FilterSidebar';
import VisaCard from './VisaCard';
import type { VisaProduct } from '../../types/visa-types';

const VisaListing: React.FC = () => {
    const { category, country } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const allVisas = useAppSelector(selectAllVisas);
    const loading = useAppSelector(selectVisasLoading);

    const [filteredVisas, setFilteredVisas] = useState<VisaProduct[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'duration'>('popular');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<any>({
        country: 'ALL',
        duration: 'ALL',
        entryType: 'ALL',
        priceRange: { min: 0, max: 10000 },
    });

    // Fetch visas on mount
    useEffect(() => {
        dispatch(fetchVisas());
    }, [dispatch]);

    // Apply all filters whenever dependencies change
    useEffect(() => {
        if (allVisas.length === 0) return;

        let visas = [...allVisas];

        // Apply URL-based filters (category or country from route)
        if (category) {
            visas = visas.filter(visa =>
                visa.productType?.toLowerCase() === category.toLowerCase() ||
                visa.category?.toLowerCase() === category.toLowerCase()
            );
        }

        if (country) {
            visas = visas.filter(visa =>
                visa.country.toLowerCase().replace(/\s+/g, '-') === country.toLowerCase()
            );
        }

        // Apply sidebar filters
        if (activeFilters.country !== 'ALL') {
            visas = visas.filter(visa =>
                visa.country.toLowerCase().replace(/\s+/g, '-') === activeFilters.country
            );
        }

        if (activeFilters.duration !== 'ALL') {
            visas = visas.filter(visa => visa.duration === activeFilters.duration);
        }

        if (activeFilters.entryType !== 'ALL') {
            visas = visas.filter(visa => visa.entryType === activeFilters.entryType);
        }

        // Apply search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            visas = visas.filter(visa =>
                visa.title.toLowerCase().includes(query) ||
                visa.country.toLowerCase().includes(query) ||
                visa.category.toLowerCase().includes(query) ||
                visa.duration.toLowerCase().includes(query) ||
                visa.entryType.toLowerCase().includes(query)
            );
        }

        // Apply price range filter
        visas = visas.filter(visa =>
            visa.price >= activeFilters.priceRange.min &&
            visa.price <= activeFilters.priceRange.max
        );

        setFilteredVisas(visas);
    }, [allVisas, category, country, activeFilters, searchQuery]);

    const handleFilterChange = (filters: any) => {
        setActiveFilters(filters);
    };

    const handleSort = (sortType: typeof sortBy) => {
        setSortBy(sortType);
        let sorted = [...filteredVisas];

        switch (sortType) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'duration':
                sorted.sort((a, b) => {
                    const aDays = parseDuration(a.duration);
                    const bDays = parseDuration(b.duration);
                    return aDays - bDays;
                });
                break;
            case 'popular':
                // Sort by lowest price (most accessible/popular)
                sorted.sort((a, b) => a.price - b.price);
                break;
            default:
                break;
        }

        setFilteredVisas(sorted);
    };

    // Helper to parse duration to days
    const parseDuration = (duration: string): number => {
        const match = duration.match(/(\d+)\s*(HOURS?|DAYS?|YEAR)/i);
        if (!match) return 0;

        const value = parseInt(match[1]);
        const unit = match[2].toUpperCase();

        if (unit.includes('HOUR')) return value / 24;
        if (unit.includes('DAY')) return value;
        if (unit.includes('YEAR')) return value * 365;

        return 0;
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    // Get page title
    const getPageTitle = () => {
        if (category) return `${category} Visas`;
        if (country) return `${country.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Visas`;
        if (searchQuery) return `Search Results for "${searchQuery}"`;
        return 'All Visa Services';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            {(country || category) && (
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <nav className="flex items-center space-x-2 text-sm">
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                Home
                            </button>
                            <span className="text-gray-400">/</span>
                            <button
                                onClick={() => navigate('/visas')}
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                All Visas
                            </button>
                            <span className="text-gray-400">/</span>
                            <span className="text-primary font-semibold">
                                {country
                                    ? country.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                    : category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                }
                            </span>
                        </nav>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="bg-primary text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {getPageTitle()}
                            </h1>
                            <p className="text-gray-200">
                                {loading ? 'Loading...' : `${filteredVisas.length} visas available`}
                            </p>
                        </div>

                        {/* Clear Filter Button - Shows when viewing specific country/category */}
                        {(country || category) && (
                            <button
                                onClick={() => navigate('/visas')}
                                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50"
                            >
                                <FiX size={18} />
                                <span className="font-semibold">View All Visas</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Clear Filter Button */}
                    {(country || category) && (
                        <button
                            onClick={() => navigate('/visas')}
                            className="sm:hidden mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30"
                        >
                            <FiX size={16} />
                            <span className="font-semibold text-sm">View All Visas</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Filters */}
                    <aside className="lg:w-80 flex-shrink-0">
                        <div className="lg:sticky lg:top-24">
                            <FilterSidebar
                                onFilterChange={handleFilterChange}
                                visaCount={filteredVisas.length}
                            />
                        </div>
                    </aside>

                    {/* Right Content - Visa Grid */}
                    <main className="flex-1">
                        {/* Search Bar */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by country, visa type, duration..."
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FiX size={20} />
                                    </button>
                                )}
                            </div>
                            {searchQuery && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Showing results for: <span className="font-semibold">"{searchQuery}"</span>
                                </p>
                            )}
                        </div>

                        {/* Active Country/Category Filter Banner */}
                        {(country || category) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <FiTrendingUp className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                Filtering by {country ? 'Country' : 'Category'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Showing {filteredVisas.length} visas for{' '}
                                                <span className="font-semibold text-blue-600">
                                                    {country
                                                        ? country.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                                        : category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                                    }
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/visas')}
                                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors border border-gray-300 hover:border-primary"
                                    >
                                        <FiX size={16} />
                                        <span className="text-sm font-medium">Clear</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Toolbar */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiTrendingUp className="text-primary" />
                                <span className="font-medium">
                                    {loading ? 'Loading...' : `${filteredVisas.length} Results`}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* Sort Dropdown */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSort(e.target.value as typeof sortBy)}
                                    className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                >
                                    <option value="popular">Popular First</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="duration">Duration</option>
                                </select>

                                {/* View Mode Toggle */}
                                <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                                ? 'bg-white text-primary shadow-sm'
                                                : 'text-gray-600'
                                            }`}
                                    >
                                        <FiGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded transition-colors ${viewMode === 'list'
                                                ? 'bg-white text-primary shadow-sm'
                                                : 'text-gray-600'
                                            }`}
                                    >
                                        <FiList size={18} />
                                    </button>
                                </div>
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
                        ) : filteredVisas.length > 0 ? (
                            <>
                                {/* Visa Grid */}
                                <div
                                    className={`grid gap-6 ${viewMode === 'grid'
                                            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                                            : 'grid-cols-1'
                                        }`}
                                >
                                    {filteredVisas.map((visa) => (
                                        <VisaCard
                                            key={visa.id}
                                            {...visa}
                                            popular={visa.price < 300}
                                        />
                                    ))}
                                </div>

                                {/* Results Info */}
                                <div className="mt-8 text-center text-sm text-gray-600">
                                    Showing {filteredVisas.length} of {allVisas.length} total visas
                                </div>
                            </>
                        ) : (
                            /* Empty State */
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {searchQuery ? 'No results found' : 'No visas found'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchQuery
                                        ? `No visas match your search for "${searchQuery}"`
                                        : 'Try adjusting your filters to see more results'
                                    }
                                </p>
                                <div className="flex gap-4 justify-center">
                                    {searchQuery && (
                                        <button
                                            onClick={clearSearch}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleFilterChange({
                                            country: 'ALL',
                                            duration: 'ALL',
                                            entryType: 'ALL',
                                            priceRange: { min: 0, max: 10000 }
                                        })}
                                        className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default VisaListing;