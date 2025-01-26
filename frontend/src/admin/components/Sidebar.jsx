// eslint-disable-next-line no-unused-vars
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/admin_assets/assets'

const Sidebar = () => {
    return (
        <div className='w-[18%] min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                <NavLink to="/admin/add" className="flex item-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l">
                    <img className='w-5 h-5' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Add Items</p>
                </NavLink>

                <NavLink to="/admin" className="flex item-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l">
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>List Items</p>
                </NavLink>

                <NavLink to="/admin/orderslist" className="flex item-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l">
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Orders</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar