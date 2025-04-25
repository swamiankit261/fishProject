// eslint-disable-next-line no-unused-vars
import React from 'react'
// import { assets } from '../assets/frontend_assets/assets';
import homepageFish from "../assets/frontend_assets/homepageFish.jpeg";

const Hero = () => {
    return (
        <div className='flex flex-col sm:flex-row border border-gray-400'>
            {/* Hero left side */}
            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-10'>
                <div className='text-[#414141]'>
                    <div className='flex items-center gap-2'>
                        <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                        <p className='font-medium text-sm md:text-base'>OUR BESTSELLER</p>
                    </div>
                    <h1 className='text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Instead of Latest Arrivals</h1>
                    <div className='flex item-center gap-2'>
                        <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                        <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                    </div>
                </div>
            </div>
            {/* Hero right side */}
            <img src={homepageFish} className='w-full  sm:w-1/2' alt="" />
        </div>
    )
}

export default Hero
