import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import shopifyFetch from '../../api/client';

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    isGuest: boolean;
}

const initialState: AuthState = {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null,
    isGuest: false,
};

// Fetch current user (for when page refreshes)
export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (customerAccessToken: string, { rejectWithValue }) => {
        try {
            const query = `
                query getCustomer($customerAccessToken: String!) {
                    customer(customerAccessToken: $customerAccessToken) {
                        id
                        email
                        firstName
                        lastName
                        displayName
                    }
                }
            `;

            const response = await shopifyFetch<{
                customer: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                    displayName: string;
                } | null;
            }>({
                query,
                variables: {
                    customerAccessToken,
                },
            });

            if (!response.customer) {
                // Token is invalid or expired
                localStorage.removeItem('accessToken');
                return rejectWithValue('Session expired. Please login again.');
            }

            return response.customer;
        } catch (error: any) {
            localStorage.removeItem('accessToken');
            return rejectWithValue(error.message || 'Failed to fetch user data');
        }
    }
);

// Login
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const mutation = `
        mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
          customerAccessTokenCreate(input: $input) {
            customerAccessToken {
              accessToken
              expiresAt
            }
            customerUserErrors {
              code
              field
              message
            }
          }
        }
      `;

            const variables = {
                input: {
                    email,
                    password,
                },
            };

            const response = await shopifyFetch<{
                customerAccessTokenCreate: {
                    customerAccessToken: { accessToken: string; expiresAt: string };
                    customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
                };
            }>({
                query: mutation,
                variables,
            });

            const { customerAccessToken, customerUserErrors } = response.customerAccessTokenCreate;

            if (customerUserErrors && customerUserErrors.length > 0) {
                return rejectWithValue(customerUserErrors[0].message);
            }

            // Get customer info
            const customerQuery = `
        query getCustomer($customerAccessToken: String!) {
          customer(customerAccessToken: $customerAccessToken) {
            id
            email
            firstName
            lastName
            displayName
          }
        }
      `;

            const customerResponse = await shopifyFetch<{
                customer: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                    displayName: string;
                };
            }>({
                query: customerQuery,
                variables: {
                    customerAccessToken: customerAccessToken.accessToken,
                },
            });

            return {
                accessToken: customerAccessToken.accessToken,
                user: customerResponse.customer,
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

// Register
export const register = createAsyncThunk(
    'auth/register',
    async (
        { email, password, firstName, lastName }: { email: string; password: string; firstName: string; lastName: string },
        { rejectWithValue }
    ) => {
        try {
            const mutation = `
        mutation customerCreate($input: CustomerCreateInput!) {
          customerCreate(input: $input) {
            customer {
              id
              email
              firstName
              lastName
              displayName
            }
            customerUserErrors {
              code
              field
              message
            }
          }
        }
      `;

            const variables = {
                input: {
                    email,
                    password,
                    firstName,
                    lastName,
                },
            };

            const response = await shopifyFetch<{
                customerCreate: {
                    customer: {
                        id: string;
                        email: string;
                        firstName: string;
                        lastName: string;
                        displayName: string;
                    };
                    customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
                };
            }>({
                query: mutation,
                variables,
            });

            const { customer, customerUserErrors } = response.customerCreate;

            if (customerUserErrors && customerUserErrors.length > 0) {
                return rejectWithValue(customerUserErrors[0].message);
            }

            // Auto login after registration
            const loginMutation = `
        mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
          customerAccessTokenCreate(input: $input) {
            customerAccessToken {
              accessToken
              expiresAt
            }
            customerUserErrors {
              code
              field
              message
            }
          }
        }
      `;

            const loginResponse = await shopifyFetch<{
                customerAccessTokenCreate: {
                    customerAccessToken: { accessToken: string; expiresAt: string };
                    customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
                };
            }>({
                query: loginMutation,
                variables: {
                    input: { email, password },
                },
            });

            const { customerAccessToken } = loginResponse.customerAccessTokenCreate;

            return {
                accessToken: customerAccessToken.accessToken,
                user: customer,
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

// Logout
export const logout = createAsyncThunk('auth/logout', async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { auth: AuthState };
        const accessToken = state.auth.accessToken;

        if (accessToken) {
            const mutation = `
        mutation customerAccessTokenDelete($customerAccessToken: String!) {
          customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
            deletedAccessToken
            deletedCustomerAccessTokenId
            userErrors {
              field
              message
            }
          }
        }
      `;

            await shopifyFetch<{
                customerAccessTokenDelete: {
                    deletedAccessToken: string;
                    deletedCustomerAccessTokenId: string;
                    userErrors: Array<{ field: string[]; message: string }>;
                };
            }>({
                query: mutation,
                variables: { customerAccessToken: accessToken },
            });
        }

        localStorage.removeItem('accessToken');
        return null;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

// Continue as Guest
export const continueAsGuest = createAsyncThunk('auth/guest', async () => {
    return { isGuest: true };
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setGuest: (state, action: PayloadAction<boolean>) => {
            state.isGuest = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch Current User
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.accessToken = null;
                state.user = null;
                state.error = action.payload as string;
            });

        // Login
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isGuest = false;
                localStorage.setItem('accessToken', action.payload.accessToken);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isGuest = false;
                localStorage.setItem('accessToken', action.payload.accessToken);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.isGuest = false;
            })
            .addCase(logout.rejected, (state) => {
                state.loading = false;
            });

        // Guest
        builder.addCase(continueAsGuest.fulfilled, (state) => {
            state.isGuest = true;
            state.isAuthenticated = false;
        });
    },
});

export const { clearError, setGuest } = authSlice.actions;
export default authSlice.reducer;