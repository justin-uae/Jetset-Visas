import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { VisaCartItem } from '../../types/visa-types';

interface ApplicantForm {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    passportNumber: string;
    nationality: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
    specialRequest: string;
}

interface CheckoutState {
    isLoading: boolean;
    error: string | null;
    checkoutUrl: string | null;
    checkoutId: string | null;
}

interface CreateCheckoutPayload {
    cartItems: VisaCartItem[];
    applicants: ApplicantForm[];
}

const initialState: CheckoutState = {
    isLoading: false,
    error: null,
    checkoutUrl: null,
    checkoutId: null,
};

// Helper function to format applicant data as custom attributes
const formatApplicantAttributes = (applicants: ApplicantForm[]) => {
    const attributes: Array<{ key: string; value: string }> = [];

    applicants.forEach((applicant, index) => {
        const applicantNumber = index + 1;

        attributes.push(
            { key: `Applicant_${applicantNumber}_Name`, value: `${applicant.firstName} ${applicant.lastName}` },
            { key: `Applicant_${applicantNumber}_Passport`, value: applicant.passportNumber },
            { key: `Applicant_${applicantNumber}_Nationality`, value: applicant.nationality },
            { key: `Applicant_${applicantNumber}_DOB`, value: applicant.dateOfBirth },
            { key: `Applicant_${applicantNumber}_Gender`, value: applicant.gender },
            { key: `Applicant_${applicantNumber}_Email`, value: applicant.email },
            { key: `Applicant_${applicantNumber}_Phone`, value: `${applicant.phoneCountryCode} ${applicant.phoneNumber}` }
        );

        if (applicant.specialRequest) {
            attributes.push({
                key: `Applicant_${applicantNumber}_Special_Request`,
                value: applicant.specialRequest,
            });
        }
    });

    return attributes;
};

// Helper function to format applicant notes
const formatApplicantNotes = (applicants: ApplicantForm[]): string => {
    return applicants
        .map((applicant, index) => {
            return `
=== APPLICANT ${index + 1} ===
Name: ${applicant.firstName} ${applicant.lastName}
Gender: ${applicant.gender}
Date of Birth: ${applicant.dateOfBirth}
Passport Number: ${applicant.passportNumber}
Nationality: ${applicant.nationality}
Email: ${applicant.email}
Phone: ${applicant.phoneCountryCode} ${applicant.phoneNumber}
Special Request: ${applicant.specialRequest || 'None'}
      `.trim();
        })
        .join('\n\n');
};

// Helper function to convert ID to Shopify GID format
const convertToGID = (id: string, resourceType: string = 'ProductVariant'): string => {
    // If already in GID format, return as is
    if (id.includes('gid://shopify/')) {
        return id;
    }

    // Extract numeric ID if it's in any other format
    const numericId = id.replace(/\D/g, '');

    // Convert to GID format
    return `gid://shopify/${resourceType}/${numericId}`;
};

// Async thunk to create Shopify checkout
export const createShopifyCheckout = createAsyncThunk(
    'checkout/createShopifyCheckout',
    async ({ cartItems, applicants }: CreateCheckoutPayload, { rejectWithValue }) => {
        try {
            const shopifyStorefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
            const shopifyDomain = import.meta.env.VITE_SHOPIFY_DOMAIN;

            if (!shopifyStorefrontToken || !shopifyDomain) {
                throw new Error('Shopify configuration is missing. Please check your environment variables.');
            }

            // Prepare line items for cart
            const lines: Array<{ merchandiseId: string; quantity: number }> = [];

            // Add main visa items
            cartItems.forEach((item) => {
                const variantId = item.selectedVariant?.id || item.visa.variants?.[0]?.id;

                if (!variantId) {
                    throw new Error(`Missing variant ID for ${item.visa.title}`);
                }

                lines.push({
                    merchandiseId: convertToGID(variantId, 'ProductVariant'),
                    quantity: item.quantity,
                });

                // Add addons as separate line items
                if (item.addons && item.addons.length > 0) {
                    item.addons.forEach((addon) => {
                        const addonId = addon.variantId || addon.id;
                        lines.push({
                            merchandiseId: convertToGID(addonId, 'ProductVariant'),
                            quantity: item.quantity,
                        });
                    });
                }
            });

            // Format applicant data for custom attributes
            const attributes = formatApplicantAttributes(applicants);

            // Get primary applicant email
            const primaryEmail = applicants[0]?.email || '';

            // Create cart mutation (replaces deprecated checkoutCreate)
            const mutation = `
        mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              code
              field
              message
            }
          }
        }
      `;

            const variables = {
                input: {
                    lines: lines,
                    buyerIdentity: {
                        email: primaryEmail,
                    },
                    attributes: attributes,
                    note: formatApplicantNotes(applicants),
                },
            };

            console.log('Cart variables:', JSON.stringify(variables, null, 2));

            // Call Shopify Storefront API
            const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken,
                },
                body: JSON.stringify({
                    query: mutation,
                    variables: variables,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to connect to Shopify. Please try again.');
            }

            const result = await response.json();

            console.log('Shopify response:', result);

            // Check for GraphQL errors
            if (result.errors) {
                throw new Error(result.errors[0]?.message || 'GraphQL error occurred');
            }

            // Check for user errors
            if (result.data?.cartCreate?.userErrors?.length > 0) {
                const errors = result.data.cartCreate.userErrors;
                throw new Error(errors[0].message);
            }

            if (!result.data?.cartCreate?.cart?.checkoutUrl) {
                throw new Error('Checkout URL not returned from Shopify');
            }

            const cart = result.data.cartCreate.cart;

            // Store applicant data in sessionStorage for later use
            sessionStorage.setItem('visa_applicants', JSON.stringify(applicants));

            return {
                checkoutUrl: cart.checkoutUrl,
                checkoutId: cart.id,
            };
        } catch (error) {
            console.error('Shopify checkout creation error:', error);
            return rejectWithValue(
                error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
            );
        }
    }
);

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        resetCheckout: (state) => {
            state.isLoading = false;
            state.error = null;
            state.checkoutUrl = null;
            state.checkoutId = null;
        },
        clearCheckoutError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createShopifyCheckout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.checkoutUrl = null;
                state.checkoutId = null;
            })
            .addCase(createShopifyCheckout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.checkoutUrl = action.payload.checkoutUrl;
                state.checkoutId = action.payload.checkoutId;
            })
            .addCase(createShopifyCheckout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.checkoutUrl = null;
                state.checkoutId = null;
            });
    },
});

export const { resetCheckout, clearCheckoutError } = checkoutSlice.actions;
export default checkoutSlice.reducer;