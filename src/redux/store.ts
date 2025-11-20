import { configureStore } from '@reduxjs/toolkit';
import visaReducer from './slices/visaSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import checkoutReducer from './slices/checkoutSlice';

export const store = configureStore({
    reducer: {
        visas: visaReducer,
        cart: cartReducer,
        auth: authReducer,
        checkout: checkoutReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;