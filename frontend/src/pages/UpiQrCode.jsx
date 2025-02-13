import QRCode from "react-qr-code";
import ShowModal from "./ShowModal";
import { Field, Form, Formik } from "formik";
import { useState } from "react";


function UpiQrCode() {
    const [showModal, setShowModal] = useState(false);
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
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${totalPrice}&cu=INR&tn=Payment%20to%20Ankit`;
    const mainModal = (
        <ShowModal sModal={sModal}>
            <h1 className="text-center font-semibold">SCAN SCAN AND PAY THEN FILL THE INPUTS</h1>
            <div className="bg-blue-gray-500 h-36 w-36 mx-auto my-4">
                {<QRCode value={upiLink} size={150} level="M"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />}
            </div>
            <Formik initialValues={{
                paymentId: "",
                upiID: '',
                phoneNo: "",
            }}>
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

                            </div>
                            <div className="">
                                <label htmlFor="phoneNo" className="text-sm font-semibold">Phone Number</label>
                                <Field
                                    type="text"
                                    id="phoneNo"
                                    name="phoneNo"
                                    placeholder="Phone Number"
                                    className={`border-2 border-gray-300 p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400`}
                                />

                            </div>
                        </div>
                        <label htmlFor="upiID" className="text-sm font-semibold -mb-3">UPI ID</label>
                        <Field
                            type="text"
                            id="upiID"
                            name="upiID"
                            placeholder="your-vpa@upi"
                            className={`border-2 border-gray-300 p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400`}
                        />
                        <button
                            type="submit"
                            onClick={sModal}
                            disabled={isSubmitting}
                            className={`mt-4 w-full text-center shadow-md text-sm bg-green-800 text-white rounded-sm px-4 py-1 font-bold hover:bg-green-700 hover:cursor-pointer ${isSubmitting && 'opacity-50'}`}
                        >
                            PAY NOW
                        </button>
                    </Form>
                )}
            </Formik>
        </ShowModal>
    )
    return (
        <>

        </>
    )
}

export default UpiQrCode
