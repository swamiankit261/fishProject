// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import Title from './Title'

const CartTotal = (props) => {
    const { Subtotal } = props ?? {}

    const tex = Subtotal * parseInt(import.meta.env.VITE_GST, 10) / 100;

    const total = Subtotal + tex + parseInt(import.meta.env.VITE_SHIPPING_PRICE, 10);

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={"CART"} text2={"TOTALS"} />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>₹ {Math.ceil(Subtotal)}.00</p>
                </div>
                <hr />
                {/* <div className='flex justify-between'>
                    <p>GST</p>
                    <p> {import.meta.env.VITE_GST} %</p>
                </div> */}
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>₹ {import.meta.env.VITE_SHIPPING_PRICE}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Total</p>
                    <p>₹ {Math.ceil(total)}</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal