import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "../consttants";


const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fatchOrder: builder.query({
            query: () => ({
                url: `${ORDER_URL}/myOrder`,
                method: 'GET'
            })
        }),
        createOrder: builder.mutation({
            query: (order) => ({
                url: `${ORDER_URL}/newOrder`,
                method: 'POST',
                body: order
            }),
            transformResponse: (response) => response
        }),
        getAdminOrder: builder.query({
            query: (QueryParams) => ({
                url: `${ORDER_URL}/adminOrder/?${QueryParams}`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data
        }),
        updateOrderAdmin: builder.mutation({
            query: (order) => ({
                url: `${ORDER_URL}/updateOrder`,
                method: 'PATCH',
                body: order
            }),
            // transformResponse: (response) => response
        }),
        deleteOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDER_URL}/${orderId}`,
                method: 'DELETE'
            }),
            // transformResponse: (response) => response
        })
    })
});

export const { useFatchOrderQuery, useCreateOrderMutation, useGetAdminOrderQuery, useUpdateOrderAdminMutation, useDeleteOrderMutation } = orderApiSlice