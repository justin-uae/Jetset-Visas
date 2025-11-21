import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface Currency {
    code: string;
    symbol: string;
    name: string;
    flag: string;
    rate: number;
}

// Static currency info (symbols, names, flags)
const currencyInfo: Omit<Currency, 'rate'>[] = [
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
];

// Fallback rates in case API fails
const fallbackRates: Record<string, number> = {
    'AED': 1,
    'USD': 0.27,
    'EUR': 0.25,
    'GBP': 0.21,
};

interface CurrencyState {
    selectedCurrency: Currency;
    currencies: Currency[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
}

// Fetch exchange rates from API
export const fetchExchangeRates = createAsyncThunk(
    'currency/fetchExchangeRates',
    async (_, { rejectWithValue }) => {
        try {
            // Using ExchangeRate-API (free tier: 1,500 requests/month)
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/AED');

            if (!response.ok) {
                throw new Error('Failed to fetch exchange rates');
            }

            const data = await response.json();

            // Transform API response to our currency format
            const currencies: Currency[] = currencyInfo.map(info => ({
                ...info,
                rate: info.code === 'AED' ? 1 : (data.rates[info.code] || fallbackRates[info.code]),
            }));

            return {
                currencies,
                lastUpdated: new Date().toISOString(),
            };
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            return rejectWithValue('Failed to fetch exchange rates');
        }
    }
);

const getInitialCurrency = (): Currency => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    const defaultCurrencies = currencyInfo.map(info => ({
        ...info,
        rate: fallbackRates[info.code],
    }));

    if (savedCurrency) {
        const found = defaultCurrencies.find(c => c.code === savedCurrency);
        if (found) return found;
    }
    return defaultCurrencies[0]; // Default to AED
};

const initialState: CurrencyState = {
    selectedCurrency: getInitialCurrency(),
    currencies: currencyInfo.map(info => ({
        ...info,
        rate: fallbackRates[info.code],
    })),
    loading: false,
    error: null,
    lastUpdated: null,
};

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<string>) => {
            const currency = state.currencies.find(c => c.code === action.payload);
            if (currency) {
                state.selectedCurrency = currency;
                localStorage.setItem('selectedCurrency', action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExchangeRates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExchangeRates.fulfilled, (state, action) => {
                state.loading = false;
                state.currencies = action.payload.currencies;
                state.lastUpdated = action.payload.lastUpdated;

                // Update selected currency with new rate
                const updatedCurrency = action.payload.currencies.find(
                    c => c.code === state.selectedCurrency.code
                );
                if (updatedCurrency) {
                    state.selectedCurrency = updatedCurrency;
                }
            })
            .addCase(fetchExchangeRates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                // Keep using fallback rates if API fails
            });
    },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;