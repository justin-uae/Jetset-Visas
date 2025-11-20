// GCC Countries
export const GCC_COUNTRIES = [
    { country: 'UAE', label: 'United Arab Emirates', flag: '🇦🇪' },
    { country: 'SAUDI', label: 'Saudi Arabia', flag: '🇸🇦' },
    { country: 'OMAN', label: 'Oman', flag: '🇴🇲' },
    { country: 'BAHRAIN', label: 'Bahrain', flag: '🇧🇭' },
] as const;

// Global Countries (from the price list)
export const GLOBAL_COUNTRIES = [
    { country: 'ARMENIA', label: 'Armenia', flag: '🇦🇲', processingTime: '3 WORKING DAYS' },
    { country: 'AUSTRALIA', label: 'Australia', flag: '🇦🇺', processingTime: '25 WORKING DAYS' },
    { country: 'AZERBAIJAN', label: 'Azerbaijan', flag: '🇦🇿', processingTime: '4 WORKING DAYS' },
    { country: 'CANADA', label: 'Canada', flag: '🇨🇦', processingTime: '120 WORKING DAYS' },
    { country: 'EGYPT', label: 'Egypt', flag: '🇪🇬', processingTime: '5 WORKING DAYS' },
    { country: 'INDIA', label: 'India', flag: '🇮🇳', processingTime: '4 WORKING DAYS' },
    { country: 'KENYA', label: 'Kenya', flag: '🇰🇪', processingTime: '4 WORKING DAYS' },
    { country: 'KUWAIT', label: 'Kuwait', flag: '🇰🇼', processingTime: '1-2 WORKING DAYS' },
    { country: 'KYRGYZSTAN', label: 'Kyrgyzstan', flag: '🇰🇬', processingTime: '15 WORKING DAYS' },
    { country: 'MALAYSIA', label: 'Malaysia', flag: '🇲🇾', processingTime: '4 WORKING DAYS' },
    { country: 'MOROCCO', label: 'Morocco', flag: '🇲🇦', processingTime: '4 WORKING DAYS' },
    { country: 'PHILIPPINES', label: 'Philippines', flag: '🇵🇭', processingTime: '7 WORKING DAYS' },
    { country: 'QATAR', label: 'Qatar', flag: '🇶🇦', processingTime: '3 WORKING DAYS' },
    { country: 'RUSSIA', label: 'Russia', flag: '🇷🇺', processingTime: '5 WORKING DAYS' },
    { country: 'SCHENGEN', label: 'Schengen', flag: '🇪🇺', processingTime: '12 WORKING DAYS' },
    { country: 'SINGAPORE', label: 'Singapore', flag: '🇸🇬', processingTime: '6 WORKING DAYS' },
    { country: 'SOUTH AFRICA', label: 'South Africa', flag: '🇿🇦', processingTime: '12 WORKING DAYS' },
    { country: 'SRI LANKA', label: 'Sri Lanka', flag: '🇱🇰', processingTime: '3 WORKING DAYS' },
    { country: 'TANZANIA', label: 'Tanzania', flag: '🇹🇿', processingTime: '5 WORKING DAYS' },
    { country: 'THAILAND', label: 'Thailand', flag: '🇹🇭', processingTime: '10 WORKING DAYS' },
    { country: 'TURKEY', label: 'Turkey', flag: '🇹🇷', processingTime: '3-7 WORKING DAYS' },
    { country: 'UNITED KINGDOM', label: 'United Kingdom', flag: '🇬🇧', processingTime: '15 WORKING DAYS' },
    { country: 'UNITED STATES', label: 'United States', flag: '🇺🇸', processingTime: '15 WORKING DAYS' },
    { country: 'UZBEKISTAN', label: 'Uzbekistan', flag: '🇺🇿', processingTime: '6 WORKING DAYS' },
    { country: 'VIETNAM', label: 'Vietnam', flag: '🇻🇳', processingTime: '5 WORKING DAYS' },
] as const;

// Country list with codes
export const countries = [
    { code: 'AF', name: 'Afghanistan', dialCode: '+93' },
    { code: 'AL', name: 'Albania', dialCode: '+355' },
    { code: 'DZ', name: 'Algeria', dialCode: '+213' },
    { code: 'AR', name: 'Argentina', dialCode: '+54' },
    { code: 'AU', name: 'Australia', dialCode: '+61' },
    { code: 'AT', name: 'Austria', dialCode: '+43' },
    { code: 'BH', name: 'Bahrain', dialCode: '+973' },
    { code: 'BD', name: 'Bangladesh', dialCode: '+880' },
    { code: 'BE', name: 'Belgium', dialCode: '+32' },
    { code: 'BR', name: 'Brazil', dialCode: '+55' },
    { code: 'CA', name: 'Canada', dialCode: '+1' },
    { code: 'CN', name: 'China', dialCode: '+86' },
    { code: 'EG', name: 'Egypt', dialCode: '+20' },
    { code: 'FR', name: 'France', dialCode: '+33' },
    { code: 'DE', name: 'Germany', dialCode: '+49' },
    { code: 'GR', name: 'Greece', dialCode: '+30' },
    { code: 'HK', name: 'Hong Kong', dialCode: '+852' },
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62' },
    { code: 'IR', name: 'Iran', dialCode: '+98' },
    { code: 'IQ', name: 'Iraq', dialCode: '+964' },
    { code: 'IE', name: 'Ireland', dialCode: '+353' },
    { code: 'IT', name: 'Italy', dialCode: '+39' },
    { code: 'JP', name: 'Japan', dialCode: '+81' },
    { code: 'JO', name: 'Jordan', dialCode: '+962' },
    { code: 'KW', name: 'Kuwait', dialCode: '+965' },
    { code: 'LB', name: 'Lebanon', dialCode: '+961' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60' },
    { code: 'MX', name: 'Mexico', dialCode: '+52' },
    { code: 'NL', name: 'Netherlands', dialCode: '+31' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
    { code: 'NG', name: 'Nigeria', dialCode: '+234' },
    { code: 'NO', name: 'Norway', dialCode: '+47' },
    { code: 'OM', name: 'Oman', dialCode: '+968' },
    { code: 'PK', name: 'Pakistan', dialCode: '+92' },
    { code: 'PH', name: 'Philippines', dialCode: '+63' },
    { code: 'PL', name: 'Poland', dialCode: '+48' },
    { code: 'PT', name: 'Portugal', dialCode: '+351' },
    { code: 'QA', name: 'Qatar', dialCode: '+974' },
    { code: 'RU', name: 'Russia', dialCode: '+7' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
    { code: 'SG', name: 'Singapore', dialCode: '+65' },
    { code: 'ZA', name: 'South Africa', dialCode: '+27' },
    { code: 'KR', name: 'South Korea', dialCode: '+82' },
    { code: 'ES', name: 'Spain', dialCode: '+34' },
    { code: 'LK', name: 'Sri Lanka', dialCode: '+94' },
    { code: 'SE', name: 'Sweden', dialCode: '+46' },
    { code: 'CH', name: 'Switzerland', dialCode: '+41' },
    { code: 'SY', name: 'Syria', dialCode: '+963' },
    { code: 'TW', name: 'Taiwan', dialCode: '+886' },
    { code: 'TH', name: 'Thailand', dialCode: '+66' },
    { code: 'TR', name: 'Turkey', dialCode: '+90' },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'VN', name: 'Vietnam', dialCode: '+84' },
    { code: 'YE', name: 'Yemen', dialCode: '+967' }
];

// Duration Options (most common from price list)
export const DURATION_OPTIONS = [
    { value: 'ALL', label: 'All Durations' },
    { value: '48 HOURS', label: '48 Hours' },
    { value: '96 HOURS', label: '96 Hours' },
    { value: '10 DAYS', label: '10 Days' },
    { value: '14 DAYS', label: '14 Days' },
    { value: '30 DAYS', label: '30 Days' },
    { value: '60 DAYS', label: '60 Days' },
    { value: '1 YEAR', label: '1 Year' },
    { value: '5 YEAR', label: '5 Years' },
] as const;

// Visa Addons (UAE specific from price list)
// export const VISA_ADDONS = [
//     {
//         id: 'express-visa',
//         shopifyId: 'express-visa-addon',
//         title: 'Express Visa Processing',
//         price: 150,
//         type: AddonType.EXPRESS_VISA,
//         description: 'Get your visa processed faster',
//     },
//     {
//         id: 'covid-insurance-30',
//         shopifyId: 'covid-insurance-30-addon',
//         title: '30 Days COVID Insurance',
//         price: 10,
//         type: AddonType.COVID_INSURANCE,
//         description: 'COVID-19 travel insurance coverage',
//     },
//     {
//         id: 'covid-insurance-60',
//         shopifyId: 'covid-insurance-60-addon',
//         title: '60 Days COVID Insurance',
//         price: 20,
//         type: AddonType.COVID_INSURANCE,
//         description: 'COVID-19 travel insurance coverage',
//     },
//     {
//         id: 'extension',
//         shopifyId: 'extension-addon',
//         title: 'Inside Country Extension',
//         price: 980,
//         type: AddonType.EXTENSION,
//         description: 'Extend your visa while in the country',
//     },
//     {
//         id: 'modification',
//         shopifyId: 'modification-addon',
//         title: 'Visa Modification',
//         price: 200,
//         type: AddonType.MODIFICATION,
//         description: 'Modify your existing visa details',
//     },
// ] as const;

// Popular Visas (featured on homepage)
export const POPULAR_VISA_HANDLES = [
    'uae-30-days-single-entry-tourist-visa',
    'uae-60-days-single-entry-tourist-visa',
    'india-30-days-tourist-e-visa',
    'saudi-1-year-multi-entry-tourist-e-visa',
    'schengen-visa',
    'united-states-visa',
] as const;

// Contact Information
export const CONTACT_INFO = {
    email: 'info@jetsetvisas.ae',
    phone: '+971 54 567 2633',
    extension: 'Visa',
    a2aEmail: 'info@jetsetvisas.ae',
    companyName: 'Jetset Visas',
} as const;

// Important Notes
export const IMPORTANT_NOTES = [
    'All prices are in AED (UAE Dirhams)',
    'Prices may vary based on nationality',
    'Visa is subject to approval from immigration department',
    '100% non-refundable once applied or if rejected',
    'In case of overstay, abscond fee will be charged',
] as const;

// Price Range for filters
export const PRICE_RANGE = {
    min: 0,
    max: 10000,
    step: 50,
} as const;

// API Configuration
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
export const API_CONFIG = {
    shopifyStorefrontUrl: SHOPIFY_DOMAIN,
    shopifyStorefrontToken: SHOPIFY_STOREFRONT_TOKEN,
} as const;

// SEO Configuration
export const SEO_CONFIG = {
    defaultTitle: 'Visa Services - UAE & Global Visa Processing',
    defaultDescription:
        'Get your UAE, Saudi, Oman, Bahrain, and global visas processed quickly and easily. Tourist visas, business visas, and more.',
    defaultKeywords: [
        'UAE visa',
        'Dubai visa',
        'tourist visa',
        'business visa',
        'Saudi visa',
        'Oman visa',
        'Bahrain visa',
        'visa processing',
        'travel visa',
    ],
    // siteUrl: process.env.REACT_APP_SITE_URL || 'https://visaservices.ae',
    organizationName: 'Jetset Visa',
} as const;