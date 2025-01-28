import { apiSlice } from "./apiSlice";
import { PRODUCT_URL } from "../consttants";


const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchProducts: builder.query({
            query: (QueryParams) => ({
                url: `${PRODUCT_URL}/search/?${QueryParams}`,
                method: 'GET',
            }),
            // transformResponse: (response) => response.data,
            providesTags: ['Products'],
        }),
        fetchProductById: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/getProduct/${productId}`,
                method: 'GET',
            })
        }),
        getHomeProduct: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}/homeProduct`,
                method: 'GET',
            }),
            // transformResponse: (response) => response.data,
            providesTags: ['Home'],
        }),
        getBestSellerProduct: builder.query({
            query: () => ({
                url: `${PRODUCT_URL}/bestSeller`,
                method: 'GET',
            })
        }),
        fatchProductByAdmin: builder.query({
            query: (QueryParams) => ({
                url: `${PRODUCT_URL}/adminProduct/?${QueryParams}`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
            providesTags: ['Admin'],
        }),
        createProduct: builder.mutation({
            query: (product) => ({
                url: `${PRODUCT_URL}/create`,
                method: 'POST',
                body: product,
            }),
            // transformResponse: (response) => response.data,
        }),
        updateProduct: builder.mutation({
            query: (id, product) => ({
                url: `${PRODUCT_URL}/update/${id}`,
                method: 'PUT',
                body: product,
            })
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `${PRODUCT_URL}/delete/${id}`,
                method: 'DELETE',
            })
        })
    }),
})


export const { useFetchProductsQuery, useFetchProductByIdQuery, useGetHomeProductQuery, useGetBestSellerProductQuery,
    useFatchProductByAdminQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productApiSlice;