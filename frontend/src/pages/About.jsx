// eslint-disable-next-line no-unused-vars
import React from 'react'
import Title from '../components/Title'
import NewsLetterBox from '../components/NewsLetterBox';
import Carousel from '../components/Carousel';

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
                <img src="myimg/me2.jpeg" className='w-full md:max-w-[450px]' alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/3 text-gray-600'>
                    <p>This isn’t just a comeback—it&apos;s a mission. A significant portion of the money I make here will go directly into Wildlife Rescues and supporting animals in need. So when you buy from me, you&apos;re not just getting quality fish—you’re also contributing to a bigger cause.</p>
                    <p>If ever something goes wrong or doesn’t go as planned, please don’t lose hope in me. I promise to sort out your concerns personally and make things right. Your trust means the world, and I’m here for the long haul.</p>
                    <b className='text-gray-800'>OUR MISSSION</b>
                    <p>My goal is to bring you the best fishes and aquarium essentials at the best possible prices. I’ll be doing my best to ensure you get healthy, vibrant fishes and products you can trust—without breaking the bank.</p>
                </div>
            </div>
            <Carousel />
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
