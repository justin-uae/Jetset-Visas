const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const STOREFRONT_API_VERSION = '2024-01';

if (!SHOPIFY_STOREFRONT_TOKEN || !SHOPIFY_DOMAIN) {
    throw new Error('Missing Shopify environment variables');
}

export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;

interface GraphQLError {
    message: string;
    extensions?: {
        code?: string;
    };
}

interface GraphQLResponse<T> {
    data?: T;
    errors?: GraphQLError[];
}

/**
 * Generic Shopify Storefront API fetch function
 */
export async function shopifyFetch<T>({
    query,
    variables = {},
}: {
    query: string;
    variables?: Record<string, any>;
}): Promise<T> {
    try {
        const response = await fetch(SHOPIFY_STOREFRONT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json: GraphQLResponse<T> = await response.json();

        if (json.errors) {
            console.error('GraphQL Errors:', json.errors);
            throw new Error(json.errors[0].message);
        }

        if (!json.data) {
            throw new Error('No data returned from Shopify');
        }

        return json.data;
    } catch (error) {
        console.error('Shopify API Error:', error);
        throw error instanceof Error
            ? error
            : new Error('Unknown error occurred while fetching from Shopify');
    }
}

/**
 * Helper to extract Shopify ID from GID
 * Example: "gid://shopify/Product/123456" -> "123456"
 */
export function extractShopifyId(gid: string): string {
    const parts = gid.split('/');
    return parts[parts.length - 1];
}

/**
 * Helper to create Shopify GID
 * Example: ("Product", "123456") -> "gid://shopify/Product/123456"
 */
export function createShopifyGid(type: string, id: string): string {
    return `gid://shopify/${type}/${id}`;
}

/**
 * Parse metafields array into a key-value object
 */
export function parseMetafields(metafields: any[]): Record<string, any> {
    return metafields.reduce((acc, field) => {
        if (!field) return acc;

        const { key, value, type } = field;

        // Parse JSON metafields
        if (type === 'json' && value) {
            try {
                acc[key] = JSON.parse(value);
            } catch {
                acc[key] = value;
            }
        }
        // Parse boolean metafields
        else if (type === 'boolean') {
            acc[key] = value === 'true';
        }
        // Parse number metafields
        else if (type === 'number_decimal' || type === 'number_integer') {
            acc[key] = parseFloat(value);
        }
        // Default to string
        else {
            acc[key] = value;
        }

        return acc;
    }, {} as Record<string, any>);
}

export default shopifyFetch;