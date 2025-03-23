import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../consttants";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProfile: builder.query({
            query: (token) => ({
                url: `${USERS_URL}/profile`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                credentials: "include",
                transformResponse: (response) => response
            })
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                credentials: 'include',
                body: data,
                transformResponse: (response) => response
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data,
                credentials: "include",
                transformResponse: (response) => response
            })
        }),
        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/updateUser`,
                method: 'PUT',
                body: data, credentials: "include",
                transformResponse: (response) => response
            })
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'GET', credentials: "include",
                transformResponse: (response) => response
            })
        })
    }),
})

export const { useGetProfileQuery, useLoginMutation, useRegisterMutation, useUpdateUserProfileMutation, useLogoutUserMutation } = userApiSlice;