import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload.data;
        },
        logout: (state) => {
            localStorage.removeItem("cartItems")
            localStorage.removeItem("cartTotal")
            localStorage.removeItem("address")
            state.userInfo = null;
            // localStorage.clear();
            window.location.href = '/';
            // return initialState
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;