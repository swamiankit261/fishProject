// eslint-disable-next-line no-unused-vars
import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdAddCircleOutline } from "react-icons/md";
import { GiCirclingFish } from "react-icons/gi";
// import { GiTakeMyMoney } from "react-icons/gi";
import { TbMenuOrder } from "react-icons/tb";

const Sidebar = () => {
    return (
        <div className='w-[18%] min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                <NavLink to="/admin/add" className="flex item-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l">
                    <MdAddCircleOutline className='text-2xl' />
                    <p className='hidden md:block'>Add Items</p>
                </NavLink>

                <NavLink to="/admin" className="flex item-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l">
                    <GiCirclingFish className='text-2xl' />
                    <p className='hidden md:block'>List Items</p>
                </NavLink>

                <NavLink to="/admin/orderslist" className="flex item-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l">
                    <TbMenuOrder className='text-2xl' />
                    <p className='hidden md:block'>Orders</p>
                </NavLink>
                {/* <NavLink to="/admin/orderslist" className="flex item-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l">
                    <GiTakeMyMoney className='text-2xl' />
                    <p className='hidden md:block'>Orders</p>
                </NavLink> */}
            </div>
        </div>
    )
}

export default Sidebar