// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
    const [currenState, setCurrenState] = useState("Contact us")

    return (
        <>
            <div className='text-cente text-2xl pt-10 border-t'>
                <Title text1={"CONTACT"} text2={"US"} />
            </div>
            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 '>
                <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
                <div className='flex flex-col justify-center items-start gap-6'>
                    <p className='font-semibold text-xl text-gray-600'>Out Store</p>
                    <p className='text-gray-500'>6/433, Hanshvihar <br />,RIICO area , mansarovar jaiur</p>
                    <p className='text-gray-500'>Mobile no.:+9145994506 <br></br></p>
                    <p className='font-semibold text-xl text-gray-600'>Careers at forever</p>
                    <p className='text-gray-500'>Learn More about our team and Openings </p>
                    <button className=' border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore</button>
                </div>
            </div>
            <NewsLetterBox />
        </>
    )
}
export default Contact
