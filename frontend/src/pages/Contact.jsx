// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import Title from '../components/Title'
import NewsLetterBox from '../components/NewsLetterBox'
import { FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { Link } from 'react-router-dom'


const Contact = () => {

    return (
        <>
            <div className='text-cente text-2xl pt-10 border-t'>
                <Title text1={"CONTACT"} text2={"US"} />
            </div>
            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 '>
                <img className='w-full md:max-w-[480px]' src={'/wildlyi.jpeg'} alt="" />
                <div className='flex flex-col justify-center items-start gap-6'>
                    <p className='font-semibold text-xl text-gray-600'>Our Office</p>
                    <p className='text-gray-500'>O Block, <br /> Dilshad Garden. Delhi.</p>
                    <p className='text-gray-500'><a href="https://api.whatsapp.com/send?phone=+91-9310279121" className='flex'>+91-9310279121</a> <br></br></p>
                    <p className='text-gray-500'><a href="mailto: wildlyindian69@gmail.com" className='flex'><MdEmail className='text-lg' />wildlyindian69@gmail.com</a> <br></br></p>
                    <p className='font-semibold text-xl text-gray-600'>Careers at forever</p>
                    <p className='text-gray-500'>Swim with Our Team – Explore Career Openings </p>
                    <a href={'https://www.youtube.com/@WildlyIndian'} target='_blank' className=' border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore</a>
                </div>
            </div>
            <NewsLetterBox />
        </>
    )
}
export default Contact
