import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: JSON.parse(localStorage.getItem("cartItems")) ?? [],
    total: JSON.parse(localStorage.getItem("cartTotal")) ?? 0
}

const cartslice = createSlice({
    name: 'cart',
    initialState,

    reducers: {
        addItem: (state, action) => {
            const existingItem = state.items.find(i => i._id === action.payload._id);

            if (existingItem) {
                existingItem.quantity++;
                existingItem.itemTotal += action.payload.price;
            } else {
                state.items.push({ ...action.payload, quantity: 1, itemTotal: action.payload.price });
            }

            state.total = state.items.reduce((acc, item) => acc + item.itemTotal, 0);
            localStorage.setItem("cartItems", JSON.stringify(state.items));
            localStorage.setItem("cartTotal", JSON.stringify(state.total));
        },
        removeCartItem: (state, action) => {
            const item = state.items.filter(item => item._id === action.payload._id);

            state.items.splice(action.payload._id, 1);
            state.total -= item[0].itemTotal;

            localStorage.setItem("cartItems", JSON.stringify(state.items));
            localStorage.setItem("cartTotal", JSON.stringify(state.total));
            if (state.items.length === 0) {
                localStorage.removeItem("cartItems");
                localStorage.removeItem("cartTotal");
                state.items = []
                state.total = 0;
            }
        },
        updateQuantity: (state, action) => {
            const existingItem = state.items.find(i => i._id === action.payload._id);
            if (existingItem) {
                existingItem.quantity = action.payload.quantity;
                existingItem.itemTotal = existingItem.quantity * existingItem.price;
            }
            state.total = state.items.reduce((acc, item) => acc + item.itemTotal, 0);
            localStorage.setItem("cartItems", JSON.stringify(state.items));
            localStorage.setItem("cartTotal", JSON.stringify(state.total));
            if (state.items.find(i => i.quantity === 0)) {
                localStorage.removeItem("cartItems");
                localStorage.removeItem("cartTotal");
            }
        },
        clearItemCart: (state) => {
            state.items = [];
            state.total = 0;
            localStorage.removeItem("cartItems");
            localStorage.removeItem("cartTotal");
        }
    }
})

export const { addItem, removeCartItem, updateQuantity, clearItemCart } = cartslice.actions;

export default cartslice.reducer;