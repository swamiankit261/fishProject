import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: [],
    adminOrders: [],
    address: JSON.parse(localStorage.getItem("address")) ?? {}
};

const orderReducer = createSlice({
    name: "order",
    initialState,
    reducers: {
        addOrder: (state, action) => {
            state.orders = action.payload.data;
            // state.address = action.payload.data[0].shippingAddress;
            // localStorage.setItem("address", JSON.stringify(state.address))
        },
        addAdminOrder: (state, action) => {
            state.adminOrders = action.payload;
        },
        addAddress: (state, action) => {
            state.address = action.payload;
            localStorage.setItem("address", JSON.stringify(state.address))
        },
        deleteOrder: (state, action) => {
            state.orders = state.orders.filter(order => order.id !== action.payload);
        }
    }
});

export const { addOrder, addAdminOrder, addAddress, deleteOrder } = orderReducer.actions;

export default orderReducer.reducer;