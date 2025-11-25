import { useState, useRef, useEffect } from 'react';
import { setCurrency } from '../redux/slices/currencySlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { LazyLoadImage } from 'react-lazy-load-image-component';


export function CurrencySwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const { selectedCurrency, currencies } = useAppSelector((state) => state.currency);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleCurrencyChange = (currencyCode: string) => {
        dispatch(setCurrency(currencyCode));
        setIsOpen(false);
    };

    // Map currency codes to country codes
    const getCurrencyCountryCode = (currencyCode: string): string => {
        const countryMap: Record<string, string> = {
            'AED': 'ae',
            'USD': 'us',
            'EUR': 'eu',
            'GBP': 'gb',
        };
        return countryMap[currencyCode] || 'us';
    };

    // Get flag URL from CDN
    const getFlagUrl = (currencyCode: string): string => {
        const countryCode = getCurrencyCountryCode(currencyCode);
        return `https://flagcdn.com/w40/${countryCode}.png`;
    };

    return (
        <div className="relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
            {/* Desktop/Mobile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 w-full lg:w-auto"
                aria-label="Select currency"
            >
                <LazyLoadImage
                    loading='lazy'
                    src={getFlagUrl(selectedCurrency.code)}
                    alt={`${selectedCurrency.name} flag`}
                    className="w-6 h-4 object-cover rounded shadow-sm"
                />
                <span className="font-semibold text-sm">{selectedCurrency.code}</span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Select Currency</p>
                    </div>
                    <div className="py-1">
                        {currencies.map((currency) => (
                            <button
                                key={currency.code}
                                onClick={() => handleCurrencyChange(currency.code)}
                                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors ${selectedCurrency.code === currency.code ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <LazyLoadImage
                                        loading='lazy'
                                        src={getFlagUrl(currency.code)}
                                        alt={`${currency.name} flag`}
                                        className="w-8 h-6 object-cover rounded shadow-sm"
                                    />
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {currency.code} - {currency.symbol}
                                        </p>
                                        <p className="text-xs text-gray-500">{currency.name}</p>
                                    </div>
                                </div>
                                {selectedCurrency.code === currency.code && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}