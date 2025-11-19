
// Visa Categories
// export const VISA_CATEGORIES = [
//     { value: 'ALL', label: 'All Visas' },
//     { value: VisaCategory.UAE, label: 'UAE Visas' },
//     { value: VisaCategory.SAUDI, label: 'Saudi Arabia Visas' },
//     { value: VisaCategory.OMAN, label: 'Oman Visas' },
//     { value: VisaCategory.BAHRAIN, label: 'Bahrain Visas' },
//     { value: VisaCategory.GLOBAL, label: 'Global Visas' },
// ] as const;

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