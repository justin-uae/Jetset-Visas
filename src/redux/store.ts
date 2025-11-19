import { configureStore } from '@reduxjs/toolkit';
import visaReducer from './slices/visaSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
    reducer: {
        visas: visaReducer,
        cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['cart/createCheckout/fulfilled'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;