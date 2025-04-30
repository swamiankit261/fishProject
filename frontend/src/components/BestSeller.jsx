// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react'
import Title from './Title'
import ProductItem from './Productitem'
import { useGetBestSellerProductQuery } from '../redux/api/product'
import { useDispatch, useSelector } from 'react-redux'
import { setBestSellerProducts } from '../redux/features/product/productSlice'

const BestSeller = () => {

    const dispatch = useDispatch()

    const { data } = useGetBestSellerProductQuery();

    const { bestSeller } = useSelector(store => store.products);

    const fatchData = () => {
        dispatch(setBestSellerProducts(data?.data))
    }

    // console.log(bestSeller?.length > 0)

    useEffect(() => {
        fatchData()
    }, [data]);

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'Trending'} text2={'Now'} />
                <p className='w-3/4 m-auto text-gray-700 text-xs sm:text-sm md:text-base'>
                    The Favorites Everyone’s Talking About.</p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>

                {
                    bestSeller?.length > 0 && bestSeller.map((item, index) => {
                        return (
                            <>
                                <ProductItem key={index} id={item._id} image={item.images[0].path} name={item.fishName} category={item.category} price={item.price} />
                            </>
                        )
                    }
                    )
                }
            </div>
        </div >
    )
}

export default BestSeller