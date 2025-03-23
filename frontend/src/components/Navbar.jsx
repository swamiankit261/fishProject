// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import favLogo from "../../public/favicon.jpeg"
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useLogoutUserMutation } from '../redux/api/user'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
const Navbar = (props) => {
    const [visible, setVisible] = useState(false)
    const { showSearch, setShowSearch } = props || true;
    const { items } = useSelector(store => store.cart);
    const { userInfo } = useSelector(store => store.auth)
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const response = await logoutUser().unwrap();
            if (response.success) {
                dispatch(logout())
                toast.info(`${response?.data} You are peacefully logged out`)
            }
            // console.log('User logged out successfully--', response);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSearch = () => {
        setShowSearch(!showSearch)
        if (!location.pathname.includes("collection")) {
            setShowSearch(true)
            navigate('/collection')
        }
    };

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <NavLink to='/'><img src={favLogo} className='w-36' alt="" /></NavLink>
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to="/" className="flex flex-col items-center gap-1">
                    <p>Home</p>
                    <hr className='w-2/5 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to="/collection" className="flex flex-col items-center gap-1">
                    <p>Collection</p>
                    <hr className='w-2/5 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>


                <NavLink to="/about" className="flex flex-col items-center gap-1">
                    <p>About us</p>
                    <hr className='w-2/5 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to="/contact" className="flex flex-col items-center gap-1">
                    <p>Contact us</p>
                    <hr className='w-2/5 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6 '>
                <img onClick={handleSearch} src={assets.search_icon} className='w-5 cursor-pointer' />
                <div className='group relative'>
                    <Link to="/login"><img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" /></Link>
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 bg-gray-50 rounded'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 text-gray-700 bg-slate-100 z-30 rounded'>
                            {userInfo?.role === "admin" && <NavLink className='cursor-pointer sm:hover:text-black ' to='/admin'>Admin panal</NavLink>}
                            <NavLink to={"/profile"} className='cursor-pointer sm:hover:text-black'>My profile</NavLink>
                            <NavLink className='cursor-pointer sm:hover:text-black' to='/orders'>Orders</NavLink>

                            {userInfo ? <NavLink className='cursor-pointer hover:text-black' to='/login' onClick={handleLogout}>Logout</NavLink>
                                :
                                <NavLink className='cursor-pointer hover:text-black' to='/login'>LogIn</NavLink>}
                        </div>
                    </div>
                </div>
                <Link to="/cart" className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{items.length}</p>
                </Link>
                <img onClick={() => { setVisible(true) }} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>

            {/* sidebar menu for small screens */}
            <div className={`absolute right-0 bottom-0 top-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => { setVisible(false) }} className='flex items-center gap-4 p-3'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => { setVisible(false) }} className="py-2 pl-6 border" to="/">Home</NavLink>
                    <NavLink onClick={() => { setVisible(false) }} className="py-2 pl-6 border" to="/collection">Collection</NavLink>
                    <NavLink onClick={() => { setVisible(false) }} className="py-2 pl-6 border" to="/about">About us</NavLink>
                    <NavLink onClick={() => { setVisible(false) }} className="py-2 pl-6 border" to="/contact">Contact us</NavLink>

                </div>
            </div>

        </div >
    )
}

export default Navbar
