// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import Latest_collection from '../components/Latest_collection'
import BestSeller from '../components/BestSeller'
// import Ourpolicy from '../components/Ourpolicy'
import NewsLetterBox from '../components/NewsLetterBox'
import { useDispatch } from 'react-redux'
import { useGetProfileQuery } from '../redux/api/user'
import { setCredentials } from '../redux/features/auth/authSlice'
const Home = () => {

    const dispatch = useDispatch();

    const { data } = useGetProfileQuery();

    const fatchProfile = () => {
        if (data && data.data) {
            dispatch(setCredentials(data));
        }
    }

    useEffect(() => {
        fatchProfile();
    }, [data]);

    return (
        <div>
            <Hero />
            <Latest_collection />
            <BestSeller />
            {/* <Ourpolicy /> */}
            <NewsLetterBox />
        </div>
    )
}

export default Home
