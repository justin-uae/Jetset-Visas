
export const formatPrice = (price: number): string => {
    return `AED ${price.toLocaleString('en-AE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
};

/**
 * Parse duration string to get numeric value and unit
 */
export const parseDuration = (
    duration: string
): { value: number; unit: string; days: number } => {
    const match = duration.match(/(\d+)\s*(HOURS?|DAYS?|YEAR)/i);

    if (!match) {
        return { value: 0, unit: '', days: 0 };
    }

    const value = parseInt(match[1]);
    const unit = match[2].toUpperCase();

    let days = 0;
    if (unit.includes('HOUR')) {
        days = value / 24;
    } else if (unit.includes('DAY')) {
        days = value;
    } else if (unit.includes('YEAR')) {
        days = value * 365;
    }

    return { value, unit, days };
};

/**
 * Format duration for display
 */
export const formatDuration = (duration: string): string => {
    const parsed = parseDuration(duration);
    if (parsed.value === 0) return duration;

    const unitMap: { [key: string]: string } = {
        HOURS: 'Hours',
        HOUR: 'Hour',
        DAYS: 'Days',
        DAY: 'Day',
        YEAR: 'Year',
        YEARS: 'Years',
    };

    const formattedUnit = unitMap[parsed.unit] || parsed.unit;
    return `${parsed.value} ${formattedUnit}`;
};

/**
 * Format processing time
 */
export const formatProcessingTime = (processingTime: string): string => {
    return processingTime.replace('WORKING DAYS', 'Working Days');
};

/**
 * Get visa category label
 */
/**
 * Get entry type label
 */

/**
 * Generate visa slug/handle from title
 */
export const generateVisaHandle = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

/**
 * Check if visa is for children
 */
export const isChildVisa = (title: string): boolean => {
    return title.toUpperCase().includes('CHILD');
};

/**
 * Extract visa type from title
 */
export const extractVisaType = (title: string): string => {
    const types = [
        'TOURIST VISA',
        'BUSINESS VISA',
        'TRANSIT VISA',
        'E-VISA',
        'MEDICAL VISA',
        'UMRAH VISA',
        'STICKER VISA',
    ];

    const upperTitle = title.toUpperCase();
    for (const type of types) {
        if (upperTitle.includes(type)) {
            return type;
        }
    }

    return 'TOURIST VISA'; // Default
};

/**
 * Format abscond fee
 */
export const formatAbscondFee = (fee: number): string => {
    return `${formatPrice(fee)} (if overstay occurs)`;
};

/**
 * Calculate total visa price including addons
 */
export const calculateVisaTotalPrice = (
    visaPrice: number,
    addonPrices: number[]
): number => {
    const addonsTotal = addonPrices.reduce((sum, price) => sum + price, 0);
    return visaPrice + addonsTotal;
};

/**
 * Get country flag emoji
 */
export const getCountryFlag = (country: string): string => {
    const flags: { [key: string]: string } = {
        UAE: '🇦🇪',
        SAUDI: '🇸🇦',
        OMAN: '🇴🇲',
        BAHRAIN: '🇧🇭',
        ARMENIA: '🇦🇲',
        AUSTRALIA: '🇦🇺',
        AZERBAIJAN: '🇦🇿',
        CANADA: '🇨🇦',
        EGYPT: '🇪🇬',
        INDIA: '🇮🇳',
        KENYA: '🇰🇪',
        KUWAIT: '🇰🇼',
        KYRGYZSTAN: '🇰🇬',
        MALAYSIA: '🇲🇾',
        MOROCCO: '🇲🇦',
        PHILIPPINES: '🇵🇭',
        QATAR: '🇶🇦',
        RUSSIA: '🇷🇺',
        SCHENGEN: '🇪🇺',
        SINGAPORE: '🇸🇬',
        'SOUTH AFRICA': '🇿🇦',
        'SRI LANKA': '🇱🇰',
        TANZANIA: '🇹🇿',
        THAILAND: '🇹🇭',
        TURKEY: '🇹🇷',
        'UNITED KINGDOM': '🇬🇧',
        'UNITED STATES': '🇺🇸',
        UZBEKISTAN: '🇺🇿',
        VIETNAM: '🇻🇳',
    };

    return flags[country.toUpperCase()] || '🌍';
};


/**
 * Validate passport number (basic validation)
 */
export const validatePassportNumber = (passportNumber: string): boolean => {
    // Basic validation: 6-9 alphanumeric characters
    const regex = /^[A-Z0-9]{6,9}$/i;
    return regex.test(passportNumber);
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as +XXX XX XXXX XXXX
    if (cleaned.length >= 10) {
        const countryCode = cleaned.slice(0, 3);
        const areaCode = cleaned.slice(3, 5);
        const firstPart = cleaned.slice(5, 9);
        const secondPart = cleaned.slice(9);

        return `+${countryCode} ${areaCode} ${firstPart}${secondPart ? ' ' + secondPart : ''}`;
    }

    return phone;
};

