import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/frontend_assets/assets';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useCreateOrderMutation } from '../redux/api/orderApi';
import { useNavigate } from 'react-router-dom';
import { clearItemCart } from '../redux/features/cart/cartSlice';
import { addAddress } from '../redux/features/orders/orderSlice';
import QRCode from "react-qr-code";
import ShowModal from './ShowModal';

const PlaceOrder = () => {
    const { items, total } = useSelector(store => store.cart);
    const [method, setMethod] = useState('Cash on delivery'); // Default payment method
    const [showModal, setShowModal] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const { address } = useSelector(store => store.orders);

    // Validation Schema
    const validationSchema = Yup.object().shape({
        address: Yup.string()
            .min(3, 'Address should be at least 3 characters long')
            .required('Address is required'),
        city: Yup.string()
            .min(2, 'City should be at least 2 characters long')
            .required('City is required'),
        state: Yup.string()
            .min(3, 'State should be at least 3 characters long')
            .required('State is required'),
        postalCode: Yup.string()
            .matches(/^\d{6}$/, 'Pin code must be exactly 6 digits')
            .required('Pin code is required'),
        country: Yup.string()
            .min(3, 'Country should be at least 3 characters long')
            .required('Country is required'),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
            .required('Phone number is required'),
    });



    // Submit Handler
    const handleSubmit = async (values) => {

        if (items.length === 0) {
            toast.error('No items in the cart. Please add items first.');
            return;
        }

        const data = {
            shippingAddress: values,
            orderItems: items.map(i => ({ item: i._id, quantity: i.quantity, price: i.price, image: i.image, fishName: i.fishName, size: i.size })),
            paymentMethod: method,
            paymentInfo: paymentInfo,
            // paymentInfo: {
            //     "id": "pay_1ABCDEF123",
            //     "status": "Paid"
            // },
            gst: parseInt(import.meta.env.VITE_GST, 10),
            shippingPrice: parseInt(import.meta.env.VITE_SHIPPING_PRICE, 10),
            // orderStatus: "Pending"
        };

        if (method == "UPI") {
            if (paymentInfo?.paymentId === undefined) {
                setShowModal(true);
                return;
            } else {
                try {
                    const response = await createOrder({ ...data }).unwrap();

                    if (response?.success) {
                        dispatch(addAddress(response.data.shippingAddress));
                        dispatch(clearItemCart())
                        navigate('/orders', { state: { orderId: response?.data?.orderId } }); // Redirect to Order Success page with orderId in query param
                        toast.success('Order placed successfully!', { position: "top-center", closeOnClick: true })
                    }
                } catch (error) {
                    console.error("placeOrder: ", error);
                    toast.error(error?.data?.message ?? "An unexpected error occurred.");
                }
            }
        } else {

            try {
                const response = await createOrder({ ...data }).unwrap();

                if (response?.success) {
                    dispatch(addAddress(response.data.shippingAddress));
                    dispatch(clearItemCart())
                    navigate('/orders', { state: { orderId: response?.data?.orderId } }); // Redirect to Order Success page with orderId in query param
                    toast.success('Order placed successfully!', { position: "top-center", closeOnClick: true })
                }
            } catch (error) {
                console.error("placeOrder: ", error);
                toast.error(error?.data?.message ?? "An unexpected error occurred.");
            }
        }
    };

    const sModal = () => setShowModal(!showModal);

    // const handleCloseButton = (
    //     <button onClick={sModal} className="inline-block w-full text-center mt-2 shadow-md text-sm bg-green-800 text-white rounded-sm px-4 py-1 font-bold hover:bg-green-700 hover:cursor-pointer">ACCEPT IT</button>
    // );

    const upiId = import.meta.env.VITE_UPIID; // Replace with your UPI ID
    const name = import.meta.env.VITE_ACCOUNT_HOST_NAME; // Payee name

    // Calculate Total Price
    const gst = parseInt(import.meta.env.VITE_GST, 10) || 0;
    const shippingPrice = parseInt(import.meta.env.VITE_SHIPPING_PRICE, 10) || 0;
    const tex = (total * gst) / 100;
    const totalPrice = total + tex + shippingPrice;

    // Generate UPI deep link
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${Math.ceil(totalPrice)}&cu=INR&tn=Payment%20to%20Ankit`;
    const handlePayment = (values) => {
        setPaymentInfo(values);
        setShowModal(false);
        // console.log("UPI Deep Link: ", upiLink);
        // console.log("Total Price: ", totalPrice);
    };

    // console.log("Payment Details: ", paymentInfo);
    const paymentValidations = Yup.object().shape({
        paymentId: Yup.string().matches(/^[a-zA-Z0-9\-_.]{10,35}$/, 'please enter a valid Transaction ID').required('Transaction ID is required'),
        upiID: Yup.string().matches(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, "please enter a valid UPI ID").required("UPI ID is required"),
        phoneNo: Yup.string().matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
            .required('Phone number is required'),
    });
    const mainModal = (
        <ShowModal sModal={sModal}>
            <h1 className="text-center font-semibold">SCAN AND PAY THEN FILL THE INPUTS</h1>
            <div className="bg-blue-gray-500 h-36 w-36 mx-auto my-4">
                {<QRCode value={upiLink} size={150} level="M"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />}
            </div>
            <Formik initialValues={{
                paymentId: "",
                upiID: '',
                phoneNo: "",
            }}
                validationSchema={paymentValidations}
                onSubmit={handlePayment}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                        <div className="flex flex-col gap-1 md:flex-row">
                            <div className="">
                                <label htmlFor="paymentId" className="text-sm font-semibold">Transaction ID</label>
                                <Field
                                    type="text"
                                    id="paymentId"
                                    name="paymentId"
                                    placeholder="Transaction ID / UPI Ref No."
                                    className={`border-2 border-gray-300 p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400`}
                                />
                                <ErrorMessage name="paymentId" component="p" className="text-red-600" />

                            </div>
                            <div className="">
                                <label htmlFor="phoneNo" className="text-sm font-semibold">Your Phone Number</label>
                                <Field
                                    type="text"
                                    id="phoneNo"
                                    name="phoneNo"
                                    placeholder="Phone Number"
                                    className={`border-2 border-gray-300 p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400`}
                                />
                                <ErrorMessage name="phoneNo" component="p" className="text-red-600" />

                            </div>
                        </div>
                        <label htmlFor="upiID" className="text-sm font-semibold -mb-3">Your UPI ID</label>
                        <Field
                            type="text"
                            id="upiID"
                            name="upiID"
                            placeholder="example@upi"
                            className={`border-2 border-gray-300 p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400`}
                        />
                        <ErrorMessage name="upiID" component="p" className="text-red-600" />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`mt-4 w-full text-center shadow-md text-sm bg-green-800 text-white rounded-sm px-4 py-1 font-bold hover:bg-green-700 hover:cursor-pointer ${isSubmitting && 'opacity-50'}`}
                        >
                            Submit details
                        </button>
                    </Form>
                )}
            </Formik>
        </ShowModal>
    )

    return (
        <>
            {showModal && mainModal}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
                {/* Left Side */}
                <div className="mt-8">
                    <div className="mt-8 min-w-80 w-11/12">
                        <CartTotal Subtotal={total} />
                    </div>
                    <div className="mt-12">
                        <Title text1="PAYMENT" text2="METHOD" />
                        {/* Payment Methods */}
                        <div className="flex gap-3 flex-col flex-wrap lg:flex-row">
                            {/* Stripe */}
                            <div
                                onClick={() => toast.info(`Sorry for the inconvenience, it's just UPI and Cash on Delivery for now`, { position: "bottom-right" })}
                                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'stripe' ? 'border-green-400' : ''
                                    }`}
                            >
                                <p
                                    className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''
                                        }`}
                                ></p>
                                <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
                                {/* <p>Stripe</p> */}
                            </div>

                            {/* Razorpay */}
                            <div
                                onClick={() => toast.info(`Sorry for the inconvenience, it's just UPI and Cash on Delivery for now`, { position: "bottom-right" })}
                                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'razorpay' ? 'border-green-400' : ''
                                    }`}
                            >
                                <p
                                    className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''
                                        }`}
                                ></p>
                                <img className="h-5 mx-4" src={assets.razorpay_logo} alt="Razorpay" />
                                {/* <p>Razorpay</p> */}
                            </div>

                            {/* PayPal */}
                            <div
                                onClick={() => toast.info(`Sorry for the inconvenience, it's just UPI and Cash on Delivery for now`, { position: "bottom-right" })}
                                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'paypal' ? 'border-green-400' : ''
                                    }`}
                            >
                                <p
                                    className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paypal' ? 'bg-green-400' : ''
                                        }`}
                                ></p>
                                <p>PayPal</p>
                            </div>

                            {/* UPI */}
                            <div
                                onClick={() => setMethod('UPI')}
                                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'UPI' ? 'border-green-400' : ''
                                    }`}
                            >
                                <p
                                    className={`min-w-3.5 h-3.5 border rounded-full ${method === 'UPI' ? 'bg-green-400' : ''
                                        }`}
                                ></p>
                                <p>UPI</p>
                            </div>

                            {/* Cash on Delivery */}
                            <div
                                onClick={() => setMethod('Cash on delivery')}
                                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'Cash on delivery' ? 'border-green-400' : ''
                                    }`}
                            >
                                <p
                                    className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Cash on delivery' ? 'bg-green-400' : ''
                                        }`}
                                ></p>
                                <p>Cash on Delivery</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Formik
                    initialValues={{
                        address: address.address ?? "",
                        city: address.city ?? "",
                        state: address.state ?? "",
                        postalCode: address.postalCode ?? "",
                        country: address.country ?? "",
                        phone: address.phone ?? "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                            <div className="text-xl sm:text-2xl my-3">
                                <Title text1="DELIVERY" text2="INFORMATION" />
                            </div>
                            <div className="relative pb-3 -mt-2 pt-0">
                                {address && <p className="text-green-500 absolute top-0 animate-bounce">You can also keep your old address ...</p>}
                            </div>
                            <Field
                                type="text"
                                name="address"
                                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                placeholder="Full Address"
                            />
                            <ErrorMessage name="address" component="p" className="text-red-600" />

                            <div className="flex flex-wrap gap-3">
                                <div className="">
                                    <Field
                                        type="text"
                                        name="city"
                                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                        placeholder="City"
                                    />
                                    <ErrorMessage name="city" component="p" className="text-red-600" />

                                </div>
                                <div className="">
                                    <Field
                                        type="text"
                                        name="state"
                                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                        placeholder="State"
                                    />
                                    <ErrorMessage name="state" component="p" className="text-red-600" />

                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="">
                                    <Field
                                        type="text"
                                        name="postalCode"
                                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                        placeholder="Zip Code"
                                    />
                                    <ErrorMessage name="postalCode" component="p" className="text-red-600" />

                                </div>
                                <div className="">
                                    <Field
                                        type="text"
                                        name="country"
                                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                        placeholder="Country"
                                    />
                                    <ErrorMessage name="country" component="p" className="text-red-600" />

                                </div>
                            </div>
                            <div className="flex gap-3">
                            </div>

                            <Field
                                type="text"
                                name="phone"
                                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                placeholder="Phone"
                            />
                            <ErrorMessage name="phone" component="p" className="text-red-600" />

                            {isLoading ? <button type="submit" disabled={isSubmitting} className="bg-black text-white px-16 py-3 text-sm mt-4 ..." >
                                Processing <span className='bg-yellow-400 animate-bounce ml-1 p-1 rounded-full inline-flex'></span>
                                <span className='bg-green-400 p-1 mx-1 animate-bounce rounded-full inline-flex'></span>
                                <span className='bg-green-400 p-1 animate-bounce rounded-full inline-flex'></span>
                            </button>
                                :
                                <button
                                    type="submit"
                                    className="bg-black text-white px-16 py-3 text-sm mt-4"
                                    disabled={isSubmitting}
                                >
                                    PLACE ORDER
                                </button>}
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default PlaceOrder;
