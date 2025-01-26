import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import productReducer from "./features/product/productSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import cartReducer from "./features/cart/cartSlice";
import orderReducer from "./features/orders/orderSlice";

const reducer = {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
}

export const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: import.meta.env.VITE_NODE_ENV === 'development'
});


setupListeners(store.dispatch);

export default store;
