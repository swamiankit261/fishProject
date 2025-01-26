// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { assets } from '../../assets/admin_assets/assets';
import Sidebar from '../components/Sidebar';
import { useGetAdminOrderQuery, useUpdateOrderAdminMutation } from '../../redux/api/orderApi';
import { useDispatch, useSelector } from 'react-redux';
import { addAdminOrder } from '../../redux/features/orders/orderSlice';
import { Button } from '@material-tailwind/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Title from '../../components/Title';

const OrderList = () => {
    const [activePage, setActivePage] = useState(1);
    const [searchStatus, setSearchStatus] = useState('');
    const dispatch = useDispatch();
    const searchparams = new URLSearchParams();
    searchparams.append('page', activePage);
    searchparams.append('status', searchStatus);
    const { data, refetch, isLoading } = useGetAdminOrderQuery(searchparams.toString());
    const [updateOrder] = useUpdateOrderAdminMutation();
    const { adminOrders } = useSelector((store) => store.orders);

    const fetchAllOrder = () => {
        if (data && !isLoading) {
            dispatch(addAdminOrder(data));
            console.log("Fetching all", data)
        }
    };

    const statusHandler = async (orderId, event) => {
        try {
            const updatedStatus = event.target.value;
            const response = await updateOrder({ id: orderId, orderStatus: updatedStatus }).unwrap();

            if (response?.success) {
                // const updatedOrders = adminOrders.orders.map((order) => {
                //     if (order._id === orderId) {
                //         return { ...order, orderStatus: updatedStatus };
                //     }
                //     return order;
                // });
                // dispatch(addAdminOrder({ orders: updatedOrders }));
                refetch()
                toast.success("Order status updated successfully.");
            } else {
                toast.error(response?.data?.message || "Failed to update order status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error?.data?.message || "An error occurred.");
        }
    };

    useEffect(() => {
        fetchAllOrder();
    }, [data]);

    const prev = () => {
        if (activePage > 1) setActivePage((prevPage) => prevPage - 1);
    };

    const next = () => {
        if (activePage < adminOrders?.totalPages) setActivePage((prevPage) => prevPage + 1);
    };

    const toggleSearchCategory = (e) => {
        if (searchStatus === e.target.value) {
            setSearchStatus('');
            // refetch();
        } else {
            setSearchStatus(e.target.value);
            // refetch();
        }
    }

    return (
        <div className="flex w-full">
            <Sidebar />
            <div className="w-[75%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-700 text-base">
                <div className="flex justify-between mb-2 flex-wrap">
                    <Title text1={"ALL"} text2={"Orders List"} />
                    <div className="flex gap-2">
                        <Button
                            variant="text"
                            className="flex items-center gap-2"
                            onClick={prev}
                            disabled={activePage === 1}
                        >
                            <ArrowLeftIcon strokeWidth={3} className="w-4 sm:w-5" /> Previous
                        </Button>
                        <Button
                            variant="text"
                            className="flex items-center gap-2"
                            onClick={next}
                            disabled={activePage === adminOrders?.totalPages}
                        >
                            Next
                            <ArrowRightIcon strokeWidth={3} className="w-4 sm:w-5" />
                        </Button>
                    </div>
                </div>
                {isLoading ? (
                    <Button loading={isLoading}>Loading...</Button>
                ) : (
                    <div className="flex">

                        <div className='bg-blue-'>
                            {adminOrders?.orders?.map((order) => (
                                <div
                                    key={order._id}
                                    className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
                                >
                                    <img src={assets.parcel_icon} alt="Parcel Icon" />
                                    <div>
                                        <div>
                                            {order?.orderItems?.map((item, idx) => (
                                                <p className="py-0.5" key={idx}>
                                                    <span className="font-serif font-semibold">Name:</span> {item?.fishName}{" "}
                                                    <span className="font-serif font-semibold">Quantity:</span> {item?.quantity}{" "}
                                                    <span className="font-serif font-semibold">Size:</span> {item?.size}
                                                </p>
                                            ))}
                                        </div>
                                        <p className="mt-2 mb-2 font-medium">
                                            <span className="font-serif font-semibold">UserName: </span>
                                            {order?.user[0]?.userName}
                                        </p>
                                        <div>
                                            <p>
                                                {order?.shippingAddress?.address},<br />
                                                {order?.shippingAddress?.city}, {order?.shippingAddress?.state},{" "}
                                                {order?.shippingAddress?.country}, {order?.shippingAddress?.postalCode}
                                            </p>
                                        </div>
                                        <p>{order?.shippingAddress?.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text sm:text-[15px]">Items: {order?.orderItems?.length}</p>
                                        <p className="mt-3">Method: {order?.paymentMethod}</p>
                                        <p>Payment: {order?.paidAt ? <span className={`${order?.paidAt ? "text-green-600" : ""}`}>Done</span> : "Pending"}</p>
                                        <p>Ordered Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
                                        {order?.deliveredAt && <p>Delivered Date: {new Date(order?.deliveredAt).toLocaleDateString()}</p>}
                                    </div>
                                    <p className="text-sm sm:text-[15px]">Currency: {Math.ceil(order?.totalPrice)}</p>
                                    <select
                                        onChange={(event) => statusHandler(order._id, event)}
                                        value={order?.orderStatus}
                                        className={`p-2 font-semibold hover:cursor-pointer ${order?.orderStatus === "Delivered" ? 'text-green-600' : order?.orderStatus === "Returned" ? "text-red-500" : "text-blue-600"}`}
                                    >
                                        {["Pending", "Canceled", "Shipped", "Delivered", "Returned"].map((status) => (
                                            <option key={status} className='text-black' value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                    </div>
                )}

            </div>
            <div className={` pl-5 py-3 mt-6 hidden sm:block`}>
                <p className='mb-3 text-sm font-medium '>Status Filters</p>
                {["Pending", "Canceled", "Shipped", "Delivered", "Returned"].map(ostatus => (
                    <p key={ostatus} className='flex gap-2'>
                        <input
                            className='w-3'
                            id={ostatus}
                            value={ostatus}
                            type="checkbox"
                            checked={ostatus === searchStatus}
                            onChange={toggleSearchCategory}
                        />
                        <label className='cursor-pointer' htmlFor={ostatus}>{ostatus}</label>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default OrderList;
