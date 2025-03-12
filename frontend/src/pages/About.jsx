// eslint-disable-next-line no-unused-vars
import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
    return (
        <>
            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={"ABOUT"} text2={"US"} />
            </div>
            <div className="">
                <p>
                    After working for Wildlife Rehabilitation and Animal Welfare for so many years, I finally came back from to the Aquarium Hobby! I&apos;ve always been into Aquariums and Fishes, specially some Predatory ones. A big part of the money made, is gonna go into Wildlife Rescues.
                </p>
                <p>
                    Hope I&apos;ll be able to get you the best possible Fishes/Things in the best possible prices!
                    if something goes South, kindly don&apos;t loose Hope in me; will sort out your things for sure
                </p>
            </div>
            <div className='my-10 flex flex-col md:flex-row  gap-16'>
                <img src={assets.about_img} className='w-full md:max-w-[450px]' alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/3 text-gray-600'>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum aliquam facere placeat voluptate eligendi? Ea eius, nesciunt pariatur maiores ratione nisi optio dolorem, odio ducimus perspiciatis quas. Minima, fugit consectetur.</p>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum aliquam facere placeat voluptate eligendi? Ea eius, nesciunt pariatur maiores ratione nisi optio dolorem, odio ducimus perspiciatis quas. Minima, fugit consectetur.</p>
                    <b className='text-gray-800'>OUR MISSSION</b>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit soluta aut, numquam est, iusto magnam, alias inventore omnis minus saepe odit mollitia corporis minima quia iure rerum eligendi! Eum, eligendi.</p>
                </div>
            </div>
            <div className='text-xl py-4'>
                <Title text1={"Why "} text2={"CHOOSE US"} />
            </div>
            <div className='flex flex-col md:flex-row  text-sm mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
                    <b>Quality Assurance:</b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quam temporibus aspernatur molestiae voluptatem est quisquam quaerat iste unde, odit culpa at repudiandae blanditiis doloremque vitae provident inventore explicabo dignissimos?</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
                    <b>Convenience:</b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quam temporibus aspernatur molestiae voluptatem est quisquam quaerat iste unde, odit culpa at repudiandae blanditiis doloremque vitae provident inventore explicabo dignissimos?</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
                    <b>Exceptional Customer Service:</b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quam temporibus aspernatur molestiae voluptatem est quisquam quaerat iste unde, odit culpa at repudiandae blanditiis doloremque vitae provident inventore explicabo dignissimos?</p>
                </div>
            </div>
            <NewsLetterBox />
        </>
    )
}

export default About
