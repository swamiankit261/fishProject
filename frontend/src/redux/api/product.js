import { apiSlice } from "./apiSlice";
import { PRODUCT_URL } from "../consttants";


const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchProducts: builder.query({
            query: (QueryParams) => ({
                url: `${PRODUCT_URL}/search/?${QueryParams}`,
                method: 'GET',
                credentials: "include",
            }),
            // transformResponse: (response) => response.data,
            providesTags: ['Products'],
        }),
        fetchProductById: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/getProduct/${productId}`,
                method: 'GET',
                credentials: "include",
            })
        }),
        getHomeProduct: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}/homeProduct`,
                method: 'GET',
                credentials: "include",
            }),
            // transformResponse: (response) => response.data,
            providesTags: ['Home'],
        }),
        getBestSellerProduct: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}/bestSeller`,
                method: 'GET',
                credentials: "include",
            })
        }),
        fatchProductByAdmin: builder.query({
            query: (QueryParams) => ({
                url: `${PRODUCT_URL}/adminProduct/?${QueryParams}`,
                method: 'GET',
                credentials: "include",
            }),
            transformResponse: (response) => response.data,
            providesTags: ['Admin'],
        }),
        createProduct: builder.mutation({
            query: (product) => ({
                url: `${PRODUCT_URL}/create`,
                method: 'POST',
                body: product,
                credentials: "include",
            }),
            // transformResponse: (response) => response.data,
        }),
        updateProduct: builder.mutation({
            query: ({ id, body }) => ({
                url: `${PRODUCT_URL}/update/${id}`,
                method: 'PATCH',
                body: body,
                credentials: "include",
            })
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `${PRODUCT_URL}/delete/${id}`,
                method: 'DELETE',
                credentials: "include",
            })
        })
    }),
})


export const { useFetchProductsQuery, useFetchProductByIdQuery, useGetHomeProductQuery, useGetBestSellerProductQuery,
    useFatchProductByAdminQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productApiSlice;