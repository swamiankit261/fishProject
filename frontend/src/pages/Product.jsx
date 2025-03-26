// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'
import RelatedProduct from '../components/RelatedProduct'
import { useFetchProductByIdQuery } from '../redux/api/product'
import { setProductDetails } from '../redux/features/product/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addItem } from '../redux/features/cart/cartSlice'

const Product = () => {
    const { productId } = useParams()

    const [image, setimage] = useState('')
    const [fishSize, setFishSize] = useState('')

    const dispatch = useDispatch()

    const { userInfo } = useSelector(store => store.auth)

    const { productDetails } = useSelector(store => store.products);
    // const { items, total } = useSelector(store => store.cart);
    // const { productList } = useSelector(store => store.products);

    const { data } = useFetchProductByIdQuery(productId);

    // console.log('Product   ----', productDetails)
    // console.log('productId   -', productId)
    // console.log('data   -', data)

    useEffect(() => {
        if (data?.data) {
            dispatch(setProductDetails(data.data))
        }
    }, [data, dispatch]);

    const { _id, category, countInStock, description, fishName, images, price, size } = productDetails || {};

    // console.log("item: ", { items, total })

    const addToCart = () => {
        // console.log("addToCart", arg)

        if (countInStock === 0) {
            toast.error(`Only ${countInStock} items are available in stock`, { position: "bottom-right", closeOnClick: true })
        } else if (userInfo) {
            if (!fishSize && size.includes((size) => size > 0)) {
                toast.error(`please select a size`, { position: "bottom-right" })
            } else {
                dispatch(addItem({ _id, image: images[0].path, fishName, price, size: fishSize, countInStock, quantity: 1 }))
                toast.success(`Cart added successfully`, { position: "bottom-right", closeOnClick: true })
            }

        } else {
            toast.error(`Please login to add items to cart`, { position: "bottom-right", closeOnClick: true })
        }


    }

    return productDetails ? (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
            {/* product data */}
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
                {/* product Images */}
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-x-scroll sm:justify-normal sm:w-[18.7%] w-full'>

                        {

                            images.map((item, index) => (
                                <img onClick={() => setimage(item.path)} src={item.path} key={index} className='w-[24] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                            ))
                        }
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        <img src={image ? image : images[0].path} className='w-full h-auto' alt="" />
                    </div>
                </div>
                {/* product info */}
                <div className='flex-1'>
                    <h1 className='font-medium text-2xl mt-2'>{fishName} ( {category} )</h1>
                    <div className='flex item-center gap-1 mt-2'>
                        <img src={assets.star_icon} alt="" className="w-3 h-3" />
                        <img src={assets.star_icon} alt="" className="w-3 h-3" />
                        <img src={assets.star_icon} alt="" className="w-3 h-3" />
                        <img src={assets.star_icon} alt="" className="w-3 h-3" />
                        <img src={assets.star_dull_icon} alt="" className="w-3 h-3" />
                        <p className='pl-2'>(122)</p>
                    </div>
                    <p className='mt-5 text-3xl font-medium'>₹ {price}</p>
                    {countInStock > 0 ? <p className='mt-5 text-1xl font-bold text-green-500'>In stock</p> : <p className='mt-5 text-1xl font-bold text-rose-500'>out of stock</p>}
                    {/* {countInStock <= 10 && <p className='mt-5 text-1xl font-bold text-red-500'>stock ...... </p>} */}

                    {/* <p className="text-bold mt-5">description :-</p> */}
                    <p className='mt-5 text-gray-500 md:w4/5'>{description}</p>

                    <div className='flex flex-col gap-4 my-8'>
                        <p>Select Size</p>
                        <div className='flex gap-2'>
                            {size > 0 && size?.map((item, index) => (
                                <button onClick={() => { setFishSize(item) }} className={`border py-2 px-4 bg-gray-100 ${item === fishSize ? 'border-orange-500' : ''}`} key={index}>{item} Inch </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={addToCart} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 '>ADD TO CART</button>
                    <hr className='mt-8 sm:w-4/5' />
                    <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>100% Original Product</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy with in 7 days.</p>
                    </div>
                </div>
            </div>
            {/* ------------ Description & Review Section ----------- */}
            <div className='mt-20'>
                <div className='flex'>
                    <b className='border px-5 py-3 text-sm '>Description</b>
                    <p className='border px-5 py-3 text-sm'>Review(122)</p>
                </div>
                <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                    <p>An Ecommerce website is an online plateform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where business and indivisuals can showcase their products ,interact with customers,and cunduct transition without the need for a physical presence.E-commerce websites have gained immencse popularity due to their convenience, accessibility, and the global reach they offer.  </p>
                    <p>Eccomerce website typically displaye products or services along  with description ,images,prices, and any available variaties (e.g.,size ,color).Each product usually has its own dedicated with relevant information</p>
                </div>
            </div>
            {/* ----------- display related product -------------- */}
            <RelatedProduct category={category} />
        </div >
    ) : <div className='opacity-0'></div>
}

export default Product
