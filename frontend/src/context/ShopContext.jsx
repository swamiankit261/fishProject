// eslint-disable-next-line no-unused-vars
import React, { createContext, useEffect, useState } from 'react'
import { products } from '../assets/frontend_assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext();
const ShopContextProvider = (props) => {
    const currency = "₹"
    const delivery_fee = 10
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setcartItems] = useState({})
    const navigate = useNavigate()

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size")
            return;
        }
        let cartData = structuredClone(cartItems)
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                console.log("cardid", cartData[itemId][size]);
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setcartItems(cartData)
    }

    const getCardCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item]
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalCount
    }

    const updateQantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity
        setcartItems(cartData)
    }

    const getCardAmount = () => {
        let totalAmount = 0
        for (const items in cartItems) {

            let iteminfo = products.find((product) => product._id === items)
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += iteminfo.price * cartItems[items][item]
                        console.log("item", totalAmount);
                    }
                } catch (error) {
                    console.log(error);

                }
            }
        }
        return totalAmount
    }

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCardCount, updateQantity, getCardAmount, navigate
    }

    return (
        <>
            <ShopContext.Provider value={value}>
                {props.children}
            </ShopContext.Provider>
        </>
    )

}
export default ShopContextProvider