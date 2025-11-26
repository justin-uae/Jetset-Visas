import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
    type VisaProduct,
    type VisaState,
    type VisaFilters,
    type VisaCategory,
    type EntryType,
} from '../../types/visa-types';
import { visaApi } from '../../api/visaApi';

const initialState: VisaState = {
    allVisas: [],
    filteredVisas: [],
    filters: {
        category: 'ALL',
        country: 'ALL',
        entryType: 'ALL',
        priceRange: {
            min: 0,
            max: 10000,
        },
        duration: 'ALL',
    },
    loading: false,
    error: null,
    selectedVisa: null,
};

// ============================================================================
// ASYNC THUNKS - Using Shopify Storefront API
// ============================================================================

/**
 * Fetch all visas from Shopify
 */
export const fetchVisas = createAsyncThunk(
    'visas/fetchVisas',
    async (_, { rejectWithValue }) => {
        try {
            const visas = await visaApi.fetchAllVisas();
            return visas;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to fetch visas'
            );
        }
    }
);

/**
 * Fetch single visa by handle from Shopify
 */
export const fetchVisaByHandle = createAsyncThunk(
    'visas/fetchVisaByHandle',
    async (handle: string, { rejectWithValue }) => {
        try {
            const visa = await visaApi.fetchVisaByHandle(handle);
            return visa;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to fetch visa'
            );
        }
    }
);

/**
 * Search visas
 */
export const searchVisas = createAsyncThunk(
    'visas/searchVisas',
    async (query: string, { rejectWithValue }) => {
        try {
            const visas = await visaApi.searchVisas(query);
            return visas;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to search visas'
            );
        }
    }
);

/**
 * Fetch visas by category
 */
export const fetchVisasByCategory = createAsyncThunk(
    'visas/fetchVisasByCategory',
    async (category: string, { rejectWithValue }) => {
        try {
            const visas = await visaApi.fetchVisasByCategory(category);
            return visas;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to fetch visas by category'
            );
        }
    }
);

// ============================================================================
// SLICE
// ============================================================================

const visaSlice = createSlice({
    name: 'visas',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<VisaFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.filteredVisas = applyFilters(state.allVisas, state.filters);
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
            state.filteredVisas = state.allVisas;
        },
        setSelectedVisa: (state, action: PayloadAction<VisaProduct | null>) => {
            state.selectedVisa = action.payload;
        },
        filterByCategory: (state, action: PayloadAction<VisaCategory | 'ALL'>) => {
            state.filters.category = action.payload;
            state.filteredVisas = applyFilters(state.allVisas, state.filters);
        },
        filterByCountry: (state, action: PayloadAction<string>) => {
            state.filters.country = action.payload;
            state.filteredVisas = applyFilters(state.allVisas, state.filters);
        },
        filterByEntryType: (state, action: PayloadAction<EntryType | 'ALL'>) => {
            state.filters.entryType = action.payload;
            state.filteredVisas = applyFilters(state.allVisas, state.filters);
        },
        filterByPriceRange: (
            state,
            action: PayloadAction<{ min: number; max: number }>
        ) => {
            state.filters.priceRange = action.payload;
            state.filteredVisas = applyFilters(state.allVisas, state.filters);
        },
        sortVisas: (
            state,
            action: PayloadAction<'price-asc' | 'price-desc' | 'duration' | 'popular'>
        ) => {
            const sortType = action.payload;
            let sorted = [...state.filteredVisas];

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
                    // Implement popularity logic if needed
                    break;
            }

            state.filteredVisas = sorted;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all visas
            .addCase(fetchVisas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVisas.fulfilled, (state, action) => {
                state.loading = false;
                state.allVisas = action.payload;
                state.filteredVisas = applyFilters(action.payload, state.filters);
            })
            .addCase(fetchVisas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch single visa
            .addCase(fetchVisaByHandle.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedVisa = null;
            })
            .addCase(fetchVisaByHandle.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedVisa = action.payload;
            })
            .addCase(fetchVisaByHandle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.selectedVisa = null;
            })
            // Search visas
            .addCase(searchVisas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchVisas.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredVisas = action.payload;
            })
            .addCase(searchVisas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch visas by category
            .addCase(fetchVisasByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVisasByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredVisas = action.payload;
            })
            .addCase(fetchVisasByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Apply filters to visas array
 */
function applyFilters(visas: VisaProduct[], filters: VisaFilters): VisaProduct[] {
    return visas.filter((visa) => {
        // Category filter
        if (filters.category !== 'ALL' && visa.category !== filters.category) {
            return false;
        }

        // Country filter
        if (filters.country !== 'ALL' && visa.country !== filters.country) {
            return false;
        }

        // Entry type filter
        if (filters.entryType !== 'ALL' && visa.entryType !== filters.entryType) {
            return false;
        }

        // Price range filter
        if (
            visa.price < filters.priceRange.min ||
            visa.price > filters.priceRange.max
        ) {
            return false;
        }

        // Duration filter
        if (filters.duration !== 'ALL' && visa.duration !== filters.duration) {
            return false;
        }

        return true;
    });
}

/**
 * Parse duration string to days
 */
function parseDuration(duration: string): number {
    const match = duration.match(/(\d+)\s*(HOURS?|DAYS?|YEAR)/i);
    if (!match) return 0;

    const value = parseInt(match[1]);
    const unit = match[2].toUpperCase();

    if (unit.includes('HOUR')) return value / 24;
    if (unit.includes('DAY')) return value;
    if (unit.includes('YEAR')) return value * 365;

    return 0;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const {
    setFilters,
    resetFilters,
    setSelectedVisa,
    filterByCategory,
    filterByCountry,
    filterByEntryType,
    filterByPriceRange,
    sortVisas,
} = visaSlice.actions;

// Selectors
export const selectAllVisas = (state: RootState) => state.visas.allVisas;
export const selectFilteredVisas = (state: RootState) => state.visas.filteredVisas;
export const selectVisaFilters = (state: RootState) => state.visas.filters;
export const selectSelectedVisa = (state: RootState) => state.visas.selectedVisa;
export const selectVisasLoading = (state: RootState) => state.visas.loading;
export const selectVisasError = (state: RootState) => state.visas.error;

// Advanced selectors
export const selectVisasByCategory = (state: RootState, category: VisaCategory) =>
    state.visas.allVisas.filter((visa) => visa.category === category);

export const selectVisasByCountry = (state: RootState, country: string) =>
    state.visas.allVisas.filter((visa) => visa.country === country);

export const selectUniqueCountries = (state: RootState) => {
    const countries = state.visas.allVisas.map((visa) => visa.country);
    return Array.from(new Set(countries)).sort();
};

export const selectUniqueDurations = (state: RootState) => {
    const durations = state.visas.allVisas.map((visa) => visa.duration);
    return Array.from(new Set(durations)).sort(
        (a, b) => parseDuration(a) - parseDuration(b)
    );
};

export const selectPriceRange = (state: RootState) => {
    const prices = state.visas.allVisas.map((visa) => visa.price);
    return {
        min: Math.min(...prices, 0),
        max: Math.max(...prices, 10000),
    };
};

export default visaSlice.reducer;