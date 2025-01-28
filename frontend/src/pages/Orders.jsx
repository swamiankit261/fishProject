// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from 'react'
import Title from '../components/Title'
import { useFatchOrderQuery } from '../redux/api/orderApi'
import { useDispatch, useSelector } from 'react-redux'
import { addOrder } from '../redux/features/orders/orderSlice'
const Orders = () => {
    const dispatch = useDispatch();
    const { data } = useFatchOrderQuery();

    const { orders } = useSelector(store => store.orders);


    useEffect(() => {
        if (data) { dispatch(addOrder(data)) }
    }, [data, dispatch]);
    // console.info('orders', data?.data)
    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1={"MY"} text2={"ORDERS"} />
            </div>
            <div>
                {
                    orders.map(order => order?.orderItems.map((item, index) => (
                        <div className='py-4 border-t border-b text-gray-700 flex flex-col flex-row md:items-center md:justify-between gap-4 ' key={index}>
                            <div className='flex items-start gap-6 text-sm'>
                                <img src={item.image} className='w-16 sm:w-20' alt="img" />
                                <div>
                                    <p className='sm:text-base font-medium'>₹ {item.price}</p>
                                    <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                                        {/* <p className='text-lg'>{currency}{item.orderItems[index].price}</p> */}
                                        <p>Quantity : {item.quantity}</p>
                                        <p>Size : {item.size} Inch </p>
                                    </div>
                                    <p className='mt-2'>Date: <span className='text-gray-400'>{order.createdAt}</span></p>
                                    <p className="font-semibold font-serif">{order.shippingAddress.address}</p>
                                </div>
                            </div>
                            <div className='md:w-1/2 flex justify-between'>
                                <div className='flex items-center gap-2'>
                                    <p className={`min-w-2 h-2 rounded-full ${order.orderStatus === "Pending" ? "bg-rose-500" : order.orderStatus === "Shipped" ? "bg-yellow-400" : order.orderStatus === "Delivered" && "bg-green-500"}`}></p>
                                    <p className='text-sm md:text-base'> {order.orderStatus}</p>
                                </div>
                                <button className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                            </div>
                        </div>
                    )))
                }
            </div>
        </div>
    )
}

export default Orders
