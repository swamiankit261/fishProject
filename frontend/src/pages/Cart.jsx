// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';
import { useDispatch, useSelector } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/features/cart/cartSlice';
import { toast } from 'react-toastify';
import { Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { items = [], total = 0 } = useSelector((store) => store.cart);

    const updateQantity = (countInStock, _id, size, quantity) => {
        if (quantity <= 0 || isNaN(quantity)) {
            toast.error('Invalid quantity.', { position: 'bottom-right', closeOnClick: true });
            return;
        }
        if (quantity <= countInStock) {
            dispatch(updateQuantity({ _id, size, quantity }));
        } else {
            toast.error('Insufficient stock.', { position: 'bottom-right', closeOnClick: true });
        }
    };

    const handleRemoveItem = (_id, size) => {
        dispatch(removeCartItem({ _id, size, quantity: 0 }));
        toast.info('Item removed from cart.', { position: 'bottom-right', closeOnClick: true });
    };

    console.log(items[1]);

    return (
        <div className="border-t pt-14">
            <div className="text-2xl mb-3">
                <Title text1="YOUR" text2="CART" />
            </div>
            <div>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div
                            key={index}
                            className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                        >
                            <div className="flex items-start gap-6">
                                <img className="w-16 sm:w-20" src={item.image} alt="" />
                                <div>
                                    <p className="text-xs sm:text-lg font-medium">{item.fishName}</p>
                                    <div className="flex items-center gap-5 mt-2">
                                        <p>
                                            ₹
                                            {item.price}
                                        </p>
                                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item?.size} Inch</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size='sm' onClick={() => updateQantity(item.countInStock, item._id, item.size, parseInt(item.quantity, 10) + 1)}>+</Button>
                                <span className='mt-1 w-5 text-center'>{item.quantity}</span>
                                <Button size='sm' onClick={() => updateQantity(item.countInStock, item._id, item.size, parseInt(item.quantity, 10) - 1)}>-</Button>
                            </div>
                            <img
                                onClick={() => handleRemoveItem(item._id, item.size)}
                                className="w-4 mr-4 sm:w-5 cursor-pointer"
                                src={assets.bin_icon}
                                alt="Remove"
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Your cart is empty.</p>
                )}
            </div>
            {items.length > 0 && (
                <div className="flex justify-end my-20">
                    <div className="w-full sm:w-[450px]">
                        <CartTotal Subtotal={total} />
                        <div className="w-full text-end">
                            <button
                                onClick={() => {
                                    navigate('/place-order');
                                }}
                                className="bg-black text-white text-sm my-8 px-8 py-3"
                            >
                                PROCEED TO CHECKOUT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
