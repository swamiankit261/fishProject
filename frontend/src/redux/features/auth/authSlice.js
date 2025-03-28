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
            localStorage.removeItem("cartItems");
            localStorage.removeItem("cartTotal");
            localStorage.removeItem("address");
        
            // Remove all cookies by setting their expiry date to the past
            document.cookie.split(";").forEach((cookie) => {
                document.cookie = cookie
                    .replace(/^ +/, "") // Remove spaces
                    .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"); // Expire it
            });
        
            state.userInfo = null;
            window.location.href = '/';
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;