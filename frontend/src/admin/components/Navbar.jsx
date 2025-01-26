// eslint-disable-next-line no-unused-vars
import React from 'react'
import { assets } from '../../assets/admin_assets/assets'

const Navbar = () => {
    return (
        <div className='flex justify-between'>
            <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
            <button className='bg-gray-600 text-white p-5 py-2 sm:px- sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
        </div>
    )
}

export default Navbar