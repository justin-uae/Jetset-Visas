import React, { useState } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useAppSelector } from '../../redux/hooks';
import { selectAllVisas } from '../../redux/slices/visaSlice';

interface FilterOption {
    value: string;
    label: string;
    flag: string;
    count?: number;
}

interface FilterSidebarProps {
    onFilterChange: (filters: any) => void;
    visaCount: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, visaCount }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        country: true,
        duration: false,
        entryType: false,
    });

    const [selectedFilters, setSelectedFilters] = useState({
        country: 'ALL',
        duration: 'ALL',
        entryType: 'ALL',
        priceRange: { min: 0, max: 10000 },
    });

    const allVisas = useAppSelector(selectAllVisas);

    // Dynamically build countries from Shopify data with "All" option
    const countries: FilterOption[] = React.useMemo(() => {
        const countryCounts: { [key: string]: { count: number; flag: string } } = {};

        allVisas.forEach(visa => {
            if (!countryCounts[visa.country]) {
                countryCounts[visa.country] = { count: 0, flag: visa.flag };
            }
            countryCounts[visa.country].count++;
        });

        const countryOptions = Object.entries(countryCounts)
            .map(([country, data]) => ({
                value: country.toLowerCase().replace(/\s+/g, '-'),
                label: country,
                flag: data.flag,
                count: data.count
            }))
            .sort((a, b) => b.count - a.count);

        return [
            { value: 'ALL', label: 'All Countries', flag: '🌐', count: allVisas.length },
            ...countryOptions
        ];
    }, [allVisas]);

    // Dynamically build durations from Shopify data
    const durations: FilterOption[] = React.useMemo(() => {
        const durationSet = new Set(
            allVisas
                .map(visa => visa.duration)
                .filter(duration => duration && duration.trim() !== '') // Filter out empty values
        );

        const durationOptions = Array.from(durationSet)
            .map(duration => ({
                value: duration,
                label: duration,
                flag: getDurationIcon(duration)
            }))
            .sort((a, b) => {
                const aNum = parseInt(a.value);
                const bNum = parseInt(b.value);
                return aNum - bNum;
            });

        return [
            { value: 'ALL', label: 'All Durations', flag: '⏱️' },
            ...durationOptions
        ];
    }, [allVisas])

    // Dynamically build entry types from Shopify data
    const entryTypes: FilterOption[] = React.useMemo(() => {
        const entryTypeSet = new Set(allVisas.map(visa => visa.entryType));

        const entryTypeOptions = Array.from(entryTypeSet).map(type => ({
            value: type,
            label: type,
            flag: getEntryTypeIcon(type)
        }));

        return [
            { value: 'ALL', label: 'All Types', flag: '🎫' },
            ...entryTypeOptions
        ];
    }, [allVisas]);

    // Helper functions
    function getDurationIcon(duration: string): string {
        if (duration.includes('HOUR')) return '⚡';
        if (duration.includes('YEAR')) return '📆';
        return '📅';
    }

    function getEntryTypeIcon(entryType: string): string {
        if (entryType.toLowerCase().includes('single')) return '1️⃣';
        if (entryType.toLowerCase().includes('multiple')) return '♾️';
        if (entryType.toLowerCase().includes('transit')) return '✈️';
        return '🎫';
    }

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCountryChange = (value: string) => {
        const newFilters = { ...selectedFilters, country: value };
        setSelectedFilters(newFilters);
        onFilterChange(newFilters);
        // Close mobile menu after selection
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    const handleDurationChange = (value: string) => {
        const newFilters = { ...selectedFilters, duration: value };
        setSelectedFilters(newFilters);
        onFilterChange(newFilters);
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    const handleEntryTypeChange = (value: string) => {
        const newFilters = { ...selectedFilters, entryType: value };
        setSelectedFilters(newFilters);
        onFilterChange(newFilters);
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    const clearAllFilters = () => {
        const newFilters = {
            country: 'ALL',
            duration: 'ALL',
            entryType: 'ALL',
            priceRange: { min: 0, max: 10000 },
        };
        setSelectedFilters(newFilters);
        onFilterChange(newFilters);
    };

    const FilterSection = ({
        title,
        section,
        children
    }: {
        title: string;
        section: keyof typeof expandedSections;
        children: React.ReactNode;
    }) => (
        <div className="border-b border-gray-200 py-3 sm:py-4">
            <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full text-left"
            >
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">{title}</h3>
                {expandedSections[section] ? (
                    <FiChevronUp className="text-gray-600 flex-shrink-0" size={18} />
                ) : (
                    <FiChevronDown className="text-gray-600 flex-shrink-0" size={18} />
                )}
            </button>
            {expandedSections[section] && <div className="mt-3">{children}</div>}
        </div>
    );

    const sidebarContent = (
        <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 pb-3 sm:pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <FiFilter className="mr-2 text-primary flex-shrink-0" size={18} />
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Filters</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                    {visaCount} visas available
                </div>
            </div>

            <div className="mt-3 sm:mt-4">
                {/* Clear All Filters */}
                {(selectedFilters.country !== 'ALL' ||
                    selectedFilters.duration !== 'ALL' ||
                    selectedFilters.entryType !== 'ALL') && (
                        <button
                            onClick={clearAllFilters}
                            className="w-full mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-colors font-semibold text-sm"
                        >
                            Clear All Filters
                        </button>
                    )}

                {/* Country Filter */}
                {countries.length > 0 && (
                    <FilterSection title="Select Country" section="country">
                        <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
                            {countries.map((country) => (
                                <button
                                    key={country.value}
                                    onClick={() => handleCountryChange(country.value)}
                                    className={`w-full flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all ${selectedFilters.country === country.value
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center min-w-0">
                                        {/* <span className="text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0">{country.flag}</span> */}
                                        <span className="font-medium text-xs sm:text-sm truncate">{country.label}</span>
                                    </div>
                                    {country.count && (
                                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${selectedFilters.country === country.value
                                            ? 'bg-white/20'
                                            : 'bg-gray-200'
                                            }`}>
                                            {country.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Duration Filter */}
                {durations.length > 1 && (
                    <FilterSection title="Duration" section="duration">
                        <div className="space-y-2">
                            {durations.map((dur) => (
                                <button
                                    key={dur.value}
                                    onClick={() => handleDurationChange(dur.value)}
                                    className={`w-full flex items-center p-2 rounded-lg transition-all text-left ${selectedFilters.duration === dur.value
                                        ? 'bg-primary/10 text-primary border border-primary'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-transparent'
                                        }`}
                                >
                                    <span className="mr-2 flex-shrink-0">{dur.flag}</span>
                                    <span className="text-xs sm:text-sm font-medium">{dur.label}</span>
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Entry Type Filter */}
                {entryTypes.length > 1 && (
                    <FilterSection title="Entry Type" section="entryType">
                        <div className="space-y-2">
                            {entryTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => handleEntryTypeChange(type.value)}
                                    className={`w-full flex items-center p-2 rounded-lg transition-all text-left ${selectedFilters.entryType === type.value
                                        ? 'bg-primary/10 text-primary border border-primary'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-transparent'
                                        }`}
                                >
                                    <span className="text-xs sm:text-sm font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed bottom-4 right-4 z-40 bg-primary text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-2xl flex items-center font-semibold hover:bg-primary/90 transition-colors text-sm sm:text-base"
            >
                <FiFilter className="mr-2" size={18} />
                <span>Filters</span>
                {(selectedFilters.country !== 'ALL' || selectedFilters.duration !== 'ALL' || selectedFilters.entryType !== 'ALL') && (
                    <span className="ml-2 bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {[selectedFilters.country, selectedFilters.duration, selectedFilters.entryType].filter(f => f !== 'ALL').length}
                    </span>
                )}
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-[85vw] sm:w-80 lg:w-full bg-white z-50 lg:z-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-hidden flex flex-col
          shadow-2xl lg:shadow-none
        `}
            >
                <div className="p-4 sm:p-6 flex-1 overflow-hidden">
                    {sidebarContent}
                </div>
            </div>
        </>
    );
};

export default FilterSidebar;