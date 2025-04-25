// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react'
import Title from './Title';
import ProductItem from './Productitem';
import { useDispatch, useSelector } from 'react-redux';
import { useGetHomeProductQuery } from '../redux/api/product';
import { setHomeProduct } from '../redux/features/product/productSlice';

const Latest_collection = () => {

    const dishpatch = useDispatch();

    const { homeProducts } = useSelector(store => store.products);

    const { data } = useGetHomeProductQuery();


    useEffect(() => {
        if (data) {
            dishpatch(setHomeProduct(data))
        }
    }, [data, dishpatch]);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={"LATEST"} text2={"COLLECTION"} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                Presenting you the most Underrated “INDIAN NATIVE UNDERWATER WILDLIFE
                </p>
            </div>
            {/* rendring products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    homeProducts.map((item) => (
                        <>
                            <ProductItem key={item._id} id={item._id} image={item.images[0].path} name={item.fishName} category={item.category} price={item.price} />
                        </>
                    ))
                }
            </div>
        </div>
    )
}

export default Latest_collection
