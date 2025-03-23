// eslint-disable-next-line no-unused-vars
import React from 'react'
import favLogo from "../../public/favicon.jpeg"

const Footer = () => {
    return (
        <>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={favLogo} className='mb-5 w-32' alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, tenetur?
                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>
                        <ul className='flex flex-col gap-1 text-gray-600'>
                            <li>Home</li>
                            <li>About us</li>
                            <li>Delivery</li>
                            <li>Privecy Policy</li>
                        </ul>
                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+91-9145994506</li>
                        <li>virtualshopping@gmail.com</li>
                    </ul>
                </div>


            </div>
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@codewebzz.com - All Right Reserved</p>
            </div>
        </>
    )
}

export default Footer