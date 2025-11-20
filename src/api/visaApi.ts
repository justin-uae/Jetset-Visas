import { shopifyFetch, parseMetafields, extractShopifyId } from './client';
import {
    GET_ALL_VISAS_QUERY,
    GET_VISA_BY_HANDLE_QUERY,
    GET_ADDONS_QUERY,
    CREATE_CHECKOUT_MUTATION,
    ADD_LINE_ITEMS_TO_CHECKOUT_MUTATION,
    SEARCH_VISAS_QUERY,
    GET_VISAS_BY_CATEGORY_QUERY,
} from './queries';
import type {
    VisaProduct,
    VisaAddon,
    VisaCartItem,
} from '../types/visa-types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    productType: string;
    tags: string[];
    description: string;
    descriptionHtml?: string;
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
        maxVariantPrice?: {
            amount: string;
            currencyCode: string;
        };
    };
    variants: {
        edges: Array<{
            node: {
                id: string;
                title: string;
                priceV2: {
                    amount: string;
                    currencyCode: string;
                };
                availableForSale: boolean;
                quantityAvailable?: number;
                sku?: string;
            };
        }>;
    };
    images: {
        edges: Array<{
            node: {
                url: string;
                altText: string | null;
                width?: number;
                height?: number;
            };
        }>;
    };
    metafields: Array<{
        key: string;
        value: string;
        type: string;
    }>;
}

interface CheckoutLineItem {
    variantId: string;
    quantity: number;
    customAttributes?: Array<{
        key: string;
        value: string;
    }>;
}

interface CheckoutCreateInput {
    lineItems: CheckoutLineItem[];
    email?: string;
    customAttributes?: Array<{
        key: string;
        value: string;
    }>;
}

// ============================================================================
// TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transform Shopify product to VisaProduct type
 */
function transformShopifyProductToVisa(product: ShopifyProduct): VisaProduct {
    const metafields = parseMetafields(product.metafields);

    // Get adult variant (default) or first variant
    const adultVariant = product.variants.edges.find(
        edge => edge.node.title.toLowerCase().includes('adult')
    ) || product.variants.edges[0];

    // Get child variant if exists
    const childVariant = product.variants.edges.find(
        edge => edge.node.title.toLowerCase().includes('child')
    );

    const features = metafields.features || [];
    const requirements = metafields.requirements || [];
    const importantNotes = metafields.important_notes || [];

    // Build addons array
    const addons: VisaAddon[] = [];
    if (metafields.express_available) {
        addons.push({
            id: 'express',
            title: 'Express Processing',
            price: metafields.express_price || 150,
            description: 'Get your visa processed within 12 hours',
        });
    }

    return {
        id: extractShopifyId(product.id),
        shopifyId: product.id,
        handle: product.handle,
        title: product.title,
        country: metafields.country || '',
        isGCC: metafields.is_gcc || '',
        flag: metafields.flag_emoji || '🌍',
        category: metafields.category || product.productType,
        duration: metafields.duration || '',
        entryType: metafields.entry_type || '',
        price: parseFloat(adultVariant.node.priceV2.amount),
        childPrice: childVariant
            ? parseFloat(childVariant.node.priceV2.amount)
            : metafields.child_price || null,
        processingTime: metafields.processing_time || '',
        validityPeriod: metafields.validity || '',
        stayPeriod: metafields.duration || '',
        images: product.images.edges.map(edge => edge.node.url),
        description: product.description,
        descriptionHtml: product.descriptionHtml,
        features,
        requirements,
        importantNotes,
        addons,
        variants: product.variants.edges.map(edge => ({
            id: extractShopifyId(edge.node.id),
            shopifyId: edge.node.id,
            title: edge.node.title,
            price: parseFloat(edge.node.priceV2.amount),
            available: edge.node.availableForSale,
            sku: edge.node.sku,
        })),
        tags: product.tags,
        productType: product.productType,
    };
}

/**
 * Transform Shopify product to VisaAddon type
 */
function transformShopifyProductToAddon(product: ShopifyProduct): VisaAddon {
    const variant = product.variants.edges[0];

    return {
        id: extractShopifyId(product.id),
        shopifyId: product.id,
        title: product.title,
        price: parseFloat(variant.node.priceV2.amount),
        description: product.description,
        variantId: variant.node.id,
        available: variant.node.availableForSale,
    };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch all visa products from Shopify
 */
export async function fetchAllVisas(): Promise<VisaProduct[]> {
    try {
        const response = await shopifyFetch<{
            products: {
                edges: Array<{ node: ShopifyProduct }>;
            };
        }>({
            query: GET_ALL_VISAS_QUERY,
            variables: { first: 250 },
        });

        return response.products.edges.map(edge =>
            transformShopifyProductToVisa(edge.node)
        );
    } catch (error) {
        console.error('Error fetching all visas:', error);
        throw error;
    }
}

/**
 * Fetch a single visa by handle
 */
export async function fetchVisaByHandle(handle: string): Promise<VisaProduct> {
    try {
        const response = await shopifyFetch<{
            product: ShopifyProduct;
        }>({
            query: GET_VISA_BY_HANDLE_QUERY,
            variables: { handle },
        });

        if (!response.product) {
            throw new Error(`Visa with handle "${handle}" not found`);
        }

        return transformShopifyProductToVisa(response.product);
    } catch (error) {
        console.error(`Error fetching visa by handle "${handle}":`, error);
        throw error;
    }
}

/**
 * Fetch all add-on products
 */
export async function fetchAddons(): Promise<VisaAddon[]> {
    try {
        const response = await shopifyFetch<{
            products: {
                edges: Array<{ node: ShopifyProduct }>;
            };
        }>({
            query: GET_ADDONS_QUERY,
        });

        return response.products.edges.map(edge =>
            transformShopifyProductToAddon(edge.node)
        );
    } catch (error) {
        console.error('Error fetching addons:', error);
        throw error;
    }
}

/**
 * Search visas by query
 */
export async function searchVisas(searchQuery: string): Promise<VisaProduct[]> {
    try {
        const response = await shopifyFetch<{
            products: {
                edges: Array<{ node: ShopifyProduct }>;
            };
        }>({
            query: SEARCH_VISAS_QUERY,
            variables: {
                query: `product_type:*Visa AND ${searchQuery}`,
                first: 50,
            },
        });

        return response.products.edges.map(edge =>
            transformShopifyProductToVisa(edge.node)
        );
    } catch (error) {
        console.error('Error searching visas:', error);
        throw error;
    }
}

/**
 * Fetch visas by category/product type
 */
export async function fetchVisasByCategory(category: string): Promise<VisaProduct[]> {
    try {
        const response = await shopifyFetch<{
            products: {
                edges: Array<{ node: ShopifyProduct }>;
            };
        }>({
            query: GET_VISAS_BY_CATEGORY_QUERY,
            variables: {
                productType: `product_type:"${category}"`,
                first: 100,
            },
        });

        return response.products.edges.map(edge =>
            transformShopifyProductToVisa(edge.node)
        );
    } catch (error) {
        console.error(`Error fetching visas by category "${category}":`, error);
        throw error;
    }
}

// ============================================================================
// CHECKOUT FUNCTIONS
// ============================================================================

/**
 * Build custom attributes for applicant information
 */
function buildApplicantAttributes(
    applicants: Array<{
        firstName: string;
        lastName: string;
        gender: string;
        dateOfBirth: string;
        nationality: string;
        email: string;
        phoneNumber: string;
        specialRequest?: string;
    }>
): Array<{ key: string; value: string }> {
    const attributes: Array<{ key: string; value: string }> = [];

    applicants.forEach((applicant, index) => {
        const prefix = `applicant_${index + 1}`;

        attributes.push(
            { key: `${prefix}_firstName`, value: applicant.firstName },
            { key: `${prefix}_lastName`, value: applicant.lastName },
            { key: `${prefix}_gender`, value: applicant.gender },
            { key: `${prefix}_dateOfBirth`, value: applicant.dateOfBirth },
            { key: `${prefix}_nationality`, value: applicant.nationality },
            { key: `${prefix}_email`, value: applicant.email },
            { key: `${prefix}_phoneNumber`, value: applicant.phoneNumber }
        );

        if (applicant.specialRequest) {
            attributes.push({
                key: `${prefix}_specialRequest`,
                value: applicant.specialRequest,
            });
        }
    });

    return attributes;
}

/**
 * Create Shopify checkout from cart items
 */
export async function createCheckout(
    cartItems: VisaCartItem[],
    applicantData: Array<{
        firstName: string;
        lastName: string;
        gender: string;
        dateOfBirth: string;
        nationality: string;
        email: string;
        phoneNumber: string;
        specialRequest?: string;
    }>,
    email?: string
): Promise<string> {
    try {
        // Build line items from cart
        const lineItems: CheckoutLineItem[] = [];

        cartItems.forEach(item => {
            // Use the selected variant or default to adult variant
            const variant = item.selectedVariant ||
                item.visa.variants.find(v => v.title.toLowerCase().includes('adult')) ||
                item.visa.variants[0];

            if (!variant) {
                throw new Error(`No variant found for visa: ${item.visa.title}`);
            }

            // Add main visa product
            lineItems.push({
                variantId: variant.shopifyId,
                quantity: item.quantity,
                customAttributes: [
                    { key: 'visa_title', value: item.visa.title },
                    { key: 'visa_country', value: item.visa.country },
                    { key: 'visa_duration', value: item.visa.duration },
                    { key: 'variant_type', value: variant.title }, // Adult or Child
                ],
            });

            // Add addon items
            item.addons.forEach(addon => {
                if (addon.variantId) {
                    lineItems.push({
                        variantId: addon.variantId,
                        quantity: item.quantity,
                        customAttributes: [
                            { key: 'addon_for', value: item.visa.title },
                        ],
                    });
                }
            });
        });

        // Build checkout input
        const checkoutInput: CheckoutCreateInput = {
            lineItems,
        };

        if (email) {
            checkoutInput.email = email;
        }

        // Add applicant information as custom attributes
        if (applicantData.length > 0) {
            checkoutInput.customAttributes = buildApplicantAttributes(applicantData);
        }

        const response = await shopifyFetch<{
            checkoutCreate: {
                checkout: {
                    id: string;
                    webUrl: string;
                };
                checkoutUserErrors: Array<{
                    code: string;
                    field: string[];
                    message: string;
                }>;
            };
        }>({
            query: CREATE_CHECKOUT_MUTATION,
            variables: { input: checkoutInput },
        });

        if (response.checkoutCreate.checkoutUserErrors.length > 0) {
            const error = response.checkoutCreate.checkoutUserErrors[0];
            throw new Error(error.message);
        }

        return response.checkoutCreate.checkout.webUrl;
    } catch (error) {
        console.error('Error creating checkout:', error);
        throw error;
    }
}

/**
 * Add line items to existing checkout
 */
export async function addLineItemsToCheckout(
    checkoutId: string,
    lineItems: CheckoutLineItem[]
): Promise<string> {
    try {
        const response = await shopifyFetch<{
            checkoutLineItemsAdd: {
                checkout: {
                    webUrl: string;
                };
                checkoutUserErrors: Array<{
                    code: string;
                    field: string[];
                    message: string;
                }>;
            };
        }>({
            query: ADD_LINE_ITEMS_TO_CHECKOUT_MUTATION,
            variables: {
                checkoutId,
                lineItems,
            },
        });

        if (response.checkoutLineItemsAdd.checkoutUserErrors.length > 0) {
            const error = response.checkoutLineItemsAdd.checkoutUserErrors[0];
            throw new Error(error.message);
        }

        return response.checkoutLineItemsAdd.checkout.webUrl;
    } catch (error) {
        console.error('Error adding line items to checkout:', error);
        throw error;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const visaApi = {
    fetchAllVisas,
    fetchVisaByHandle,
    fetchAddons,
    searchVisas,
    fetchVisasByCategory,
    createCheckout,
    addLineItemsToCheckout,
};

export default visaApi;