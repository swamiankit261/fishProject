// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import Title from './Title';
import ProductItem from './Productitem';

const RelatedProduct = ({ category, subCategory }) => {

    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (related) {
            let productCopy = related
            productCopy = productCopy.filter((item) => category === item.category)
            productCopy = productCopy.filter((item) => subCategory === item.subCategory)
            setRelated(productCopy.slice(0, 5));
        }
    }, [])
    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2 '>
                <Title text1="RELATED" text2="PRODUCTS" />
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {related.map((item, index) => (
                    <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
                ))}
            </div>
        </div>
    )
}

export default RelatedProduct