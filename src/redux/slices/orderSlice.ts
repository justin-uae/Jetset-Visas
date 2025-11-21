import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopifyFetch from '../../api/client';
import type { RootState } from '../store';

interface OrderLineItem {
    title: string;
    quantity: number;
    variant: {
        id: string;
        title: string;
        price: {
            amount: string;
            currencyCode: string;
        };
    } | null;
    currentQuantity: number;
}

interface Order {
    id: string;
    name: string;
    orderNumber: number;
    processedAt: string;
    financialStatus: string;
    fulfillmentStatus: string;
    totalPrice: {
        amount: string;
        currencyCode: string;
    };
    lineItems: {
        edges: Array<{
            node: OrderLineItem;
        }>;
    };
}

interface OrdersState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    loading: false,
    error: null,
};

// Fetch customer orders
export const fetchCustomerOrders = createAsyncThunk(
    'orders/fetchCustomerOrders',
    async (customerAccessToken: string, { rejectWithValue }) => {
        try {
            const query = `
                query getCustomerOrders($customerAccessToken: String!) {
                    customer(customerAccessToken: $customerAccessToken) {
                        id
                        orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
                            edges {
                                node {
                                    id
                                    name
                                    orderNumber
                                    processedAt
                                    financialStatus
                                    fulfillmentStatus
                                    totalPrice {
                                        amount
                                        currencyCode
                                    }
                                    lineItems(first: 50) {
                                        edges {
                                            node {
                                                title
                                                quantity
                                                currentQuantity
                                                variant {
                                                    id
                                                    title
                                                    price {
                                                        amount
                                                        currencyCode
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            const response = await shopifyFetch<{
                customer: {
                    id: string;
                    orders: {
                        edges: Array<{
                            node: Order;
                        }>;
                    };
                };
            }>({
                query,
                variables: {
                    customerAccessToken,
                },
            });

            if (!response.customer) {
                throw new Error('Customer not found');
            }

            const orders = response.customer.orders.edges.map((edge) => edge.node);
            return orders;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch orders');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearOrders: (state) => {
            state.orders = [];
            state.error = null;
        },
        clearOrderError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchCustomerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearOrders, clearOrderError } = orderSlice.actions;

// Selectors
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;

export default orderSlice.reducer;