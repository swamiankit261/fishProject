// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import ShopContextProvider from './context/ShopContext'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux'
import { useGetProfileQuery } from './redux/api/user'
import { setCredentials } from './redux/features/auth/authSlice'

const App = () => {
  const [showSearch, setShowSearch] = useState(true)

  const dispatch = useDispatch();

  const { data } = useGetProfileQuery();

  useEffect(() => {
    if (data && data.data) {
      dispatch(setCredentials(data));
    }
  }, [data, dispatch]);


  // console.info("Private routes", data);

  // const token = Cookies.get('accessToken')

  // console.info("token: ", JSON.stringify(token));
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px[9vw]'>
      <ShopContextProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          limit={6}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Flip}
        />
        <Navbar showSearch={showSearch} setShowSearch={setShowSearch} />
        <SearchBar showSearch={showSearch} setShowSearch={setShowSearch} />
        <Outlet />
        <Footer />
      </ShopContextProvider>
    </div>
  )
}

export default App
