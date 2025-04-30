// eslint-disable-next-line no-unused-vars
import React from 'react'
// import { assets } from '../assets/frontend_assets/assets';
import homepageFish from "../assets/frontend_assets/homepageFish.jpeg";

const Hero = () => {
    return (
        <div className='flex flex-col sm:flex-row border border-gray-400'>
            {/* Hero left side */}
            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-10'>
                <div className='text-[#414141] lg:ml-5'>
                    <div className='flex items-center gap-2'>
                        {/* <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p> */}
                        {/* <p className='font-medium text-sm md:text-base'>OUR BESTSELLER</p> */}
                    </div>
                    <h1 className='text-xl sm:py-5 ml-2 lg:text-4xl leading-relaxed'>Wonders of  Indian Waters</h1>
                    <div className='flex item-center justify-center gap-2'>
                        <p className='font-semibold text-sm md:text-base animate-bounce'>Explore NOW</p>
                        {/* <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p> */}
                    </div>
                </div>
            </div>
            {/* Hero right side */}
            <img src={homepageFish} className='w-full  sm:w-1/2' alt="" />
        </div>
    )
}

export default Hero
