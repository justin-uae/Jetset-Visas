import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { type VisaCartItem, type VisaProduct, type VisaAddon, type CartState, type VisaVariant } from '../../types/visa-types';
import { visaApi } from '../../api/visaApi';

const initialState: CartState = {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null,
};

// ============================================================================
// TYPES
// ============================================================================

interface AddToCartPayload {
    visa: VisaProduct;
    quantity: number;
    selectedVariant?: VisaVariant; // Optional: if user selected specific variant
    addons?: VisaAddon[];
    applicantInfo?: {
        name: string;
        nationality: string;
        passportNumber: string;
    };
}

interface UpdateQuantityPayload {
    itemId: string;
    quantity: number;
}

interface AddAddonPayload {
    itemId: string;
    addon: VisaAddon;
}

interface RemoveAddonPayload {
    itemId: string;
    addonId: string;
}

interface ApplicantData {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    nationality: string;
    email: string;
    phoneNumber: string;
    specialRequest?: string;
}

// ============================================================================
// ASYNC THUNKS - Using Shopify Storefront API
// ============================================================================

/**
 * Create Shopify checkout and redirect
 */
export const createCheckout = createAsyncThunk(
    'cart/createCheckout',
    async (
        applicantData: ApplicantData[],
        { getState, rejectWithValue }
    ) => {
        try {
            const state = getState() as RootState;
            const { items } = state.cart;

            if (items.length === 0) {
                throw new Error('Cart is empty');
            }

            // Get primary email from first applicant
            const primaryEmail = applicantData[0]?.email;

            // Create checkout using Shopify API
            const checkoutUrl = await visaApi.createCheckout(
                items,
                applicantData,
                primaryEmail
            );

            return checkoutUrl;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to create checkout'
            );
        }
    }
);

// ============================================================================
// SLICE
// ============================================================================

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
            const { visa, quantity, selectedVariant, addons = [], applicantInfo } = action.payload;

            // Use selected variant or default to adult variant
            const variantToUse = selectedVariant || visa.variants.find(
                v => v.title.toLowerCase().includes('adult')
            ) || visa.variants[0];

            // Check if same visa with same variant already exists in cart
            const existingItemIndex = state.items.findIndex(
                (item) => item.visa.id === visa.id && 
                         item.selectedVariant?.id === variantToUse.id
            );

            if (existingItemIndex > -1) {
                // Update quantity if visa with same variant already exists
                state.items[existingItemIndex].quantity += quantity;
                
                // Merge addons (avoid duplicates)
                if (addons.length > 0) {
                    const existingAddons = state.items[existingItemIndex].addons;
                    addons.forEach(newAddon => {
                        const addonExists = existingAddons.some(
                            a => a.id === newAddon.id
                        );
                        if (!addonExists) {
                            existingAddons.push(newAddon);
                        }
                    });
                }
            } else {
                // Add new item to cart
                state.items.push({
                    visa,
                    quantity,
                    selectedVariant: variantToUse,
                    addons,
                    applicantInfo,
                });
            }

            // Recalculate total
            state.totalAmount = calculateTotal(state.items);
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            state.items = state.items.filter((item) => item.visa.id !== itemId);
            state.totalAmount = calculateTotal(state.items);
        },

        updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
            const { itemId, quantity } = action.payload;
            const item = state.items.find((item) => item.visa.id === itemId);

            if (item) {
                if (quantity <= 0) {
                    // Remove item if quantity is 0 or less
                    state.items = state.items.filter((item) => item.visa.id !== itemId);
                } else {
                    item.quantity = quantity;
                }
                state.totalAmount = calculateTotal(state.items);
            }
        },

        addAddon: (state, action: PayloadAction<AddAddonPayload>) => {
            const { itemId, addon } = action.payload;
            const item = state.items.find((item) => item.visa.id === itemId);

            if (item) {
                // Check if addon already exists
                const addonExists = item.addons.some((a) => a.id === addon.id);
                if (!addonExists) {
                    item.addons.push(addon);
                    state.totalAmount = calculateTotal(state.items);
                }
            }
        },

        removeAddon: (state, action: PayloadAction<RemoveAddonPayload>) => {
            const { itemId, addonId } = action.payload;
            const item = state.items.find((item) => item.visa.id === itemId);

            if (item) {
                item.addons = item.addons.filter((addon) => addon.id !== addonId);
                state.totalAmount = calculateTotal(state.items);
            }
        },

        updateApplicantInfo: (
            state,
            action: PayloadAction<{
                itemId: string;
                applicantInfo: {
                    name: string;
                    nationality: string;
                    passportNumber: string;
                };
            }>
        ) => {
            const { itemId, applicantInfo } = action.payload;
            const item = state.items.find((item) => item.visa.id === itemId);

            if (item) {
                item.applicantInfo = applicantInfo;
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.error = null;
        },

        setCartError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            // Create checkout
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                // Redirect to Shopify checkout URL
                if (action.payload) {
                    window.location.href = action.payload;
                    // Clear cart after successful checkout redirect
                    state.items = [];
                    state.totalAmount = 0;
                }
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate total amount for all cart items
 */
function calculateTotal(items: VisaCartItem[]): number {
    return items.reduce((total, item) => {
        // Use selected variant price if available, otherwise use base price
        const itemPrice = item.selectedVariant 
            ? item.selectedVariant.price 
            : item.visa.price;
        
        const visaTotal = itemPrice * item.quantity;
        
        const addonsTotal = item.addons.reduce(
            (sum, addon) => sum + addon.price * item.quantity,
            0
        );
        return total + visaTotal + addonsTotal;
    }, 0);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    addAddon,
    removeAddon,
    updateApplicantInfo,
    clearCart,
    setCartError,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.totalAmount;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartItemCount = (state: RootState) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectCartItemByVisaId = (state: RootState, visaId: string) =>
    state.cart.items.find((item) => item.visa.id === visaId);

// Check if a visa is in cart
export const selectIsVisaInCart = (state: RootState, visaId: string) =>
    state.cart.items.some((item) => item.visa.id === visaId);

export default cartSlice.reducer;