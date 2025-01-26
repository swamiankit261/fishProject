import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    productList: [],
    homeProducts: [],
    adminProducts: [],
    productDetails: null,
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.productList = action.payload.data.products
        },
        setHomeProduct: (state, action) => {
            state.homeProducts = action.payload.data
        },
        setAdminProducts: (state, action) => {
            state.adminProducts = action.payload;
        },
        setProductDetails: (state, action) => {
            state.productDetails = action.payload;
        },
        clearProductDetails: (state) => {
            state.productDetails = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setProducts, setHomeProduct, setAdminProducts, setProductDetails, clearProductDetails, setLoading, setError } = productSlice.actions;

export default productSlice.reducer;
