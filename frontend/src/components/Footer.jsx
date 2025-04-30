// eslint-disable-next-line no-unused-vars
import React from 'react'
import favLogo from "../../public/favicon.jpeg";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <>
            <div className='flex flex-col sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={favLogo} className='mb-5 w-32' alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Discover our bestselling fish and supplies – handpicked favorites trusted by aquarists for quality, beauty, and underwater perfection.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    {/* <a href=""><FaFacebook /> facebook</a> */}
                    <p className='text-xl font-medium mb-5'>contact </p>
                    <a href="https://www.instagram.com/wildly_indian_official?igsh=MWE3bDgxZXh3c2E4MQ==" className='flex gap-2'> <FaInstagram className='text-2xl text-[#f64118]' />Instagram</a>
                    <a href="https://www.youtube.com/@WildlyIndian" className='flex gap-2'><FaYoutube className='text-2xl text-red-900' />youtube</a>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>
                        <ul className='flex flex-col gap-1 text-gray-600'>
                            <Link to={'/'}>Home</Link>
                            <Link to={'/collection'}>Collection</Link>
                            <Link to={'/about'}>About us</Link>
                            <Link to={'/contact'}>Delivery</Link>
                        </ul>
                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col  gap-3 text-gray-600'>
                        <li ><a href="https://api.whatsapp.com/send?phone=+91-9310279121" className='flex'><FaWhatsapp className='text-lg' />+91-9310279121</a></li>
                        <li ><a href="mailto: wildlyindian69@gmail.com" className='flex'><MdEmail className='text-lg' />wildlyindian69@gmail.com</a></li>
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