// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './Productitem'

const BestSeller = () => {
    const { products } = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([])
    useEffect(() => {
        // console.log(products);

        const bestProduct = products.filter((myitem) => (myitem.bestseller))
        setBestSeller(bestProduct.slice(0, 5))
    }, [])

    // console.log("best", bestSeller);

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-gray-700 text-xs sm:text-sm md:text-base'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, labore!</p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>

                {
                    bestSeller.map((item) => {
                        return (
                            <>
                                <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} />
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