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
                    After working for the Wildlife Rehabilitation and Animal Welfare for so many years, I finally came back to the Aquarium Hobby! I&apos;ve always been into Aquariums and Fishes, specially some Predatory ones. A big part of the money made, is gonna go into my Wildlife Rescues & Operations.
                </p>
                <p>
                    Hope I&apos;ll be able to get you the best possible Fishes/Things in the best possible prices! if something goes South, kindly don&apos;t loose Hope in me; I a quite New & will sort out your things for sure.
                </p>
            </div>
            <div className='my-10 flex flex-col md:flex-row  gap-16'>
                {/* <img src="myimg/me2.jpeg" className='w-full md:max-w-[450px]' alt="" /> */}
                <div className="md:w-1/2">
                    <Carousel />
                </div>
                <div className='flex flex-col justify-center gap-6 md:w-2/3 text-gray-600'>
                    <p>From childhood, I have been observing the utmost cruelty on Reptiles, where there were no such teams for their Rescue or Rehabilitation. Figuring out the handling skills myself,
                        my Wildlife Conservation started. After Volunteering in several NGOs, got my NGO registered & I started making up the Team, which could make a difference in the Urban Wildlife Conservation.
                        Fishes used to be a big source of Peace since then, and to generate my pocket money when I was small, I used to breed several Cichlids & setups. Which extended to the level where I was raising several Raptors and other Wild Animals.</p>
                    <p>  I have always been crazy about Predatory fishes, specially the Channa family. Arowanas were not so common back then, but I’ve had a few, and that too for many years. Understanding the comfort & stress of the Fish, I never send fishes who have been transported lately Instead, I wait for their Stability and colour to come up. It usually takes about 3-4 weeks for any fish to come at the perfect condition.</p>

                </div>

            </div>
            <div className="">
                <b className='text-gray-800'>OUR MISSSION</b>
                <p>Apart from the Rescues & the welfare: Exotic Pet keeping hobby is always a part of me, but since the Rules & Laws are still very much complicated. Still you will be able to find some very cool Lobsters, Newts, Crabs, etc. here.
                    I hope all of my experience till now, is gonna help me making this hobby great. I hope you get the Fish of your Dreams!
                </p>
            </div>
            <div className='text-xl py-4'>
                <Title text1={"Why "} text2={"CHOOSE US"} />
                <div className="text-sm">
                    <p className='text-gray-600'>From observing the Aquatic Life in Wild, to being in the Hobby from the last 19 years; I wouldn&apos;t say I know everything about them,  but I know the parts which can necessarily better this hobby. Animal Welfare has taught me about understanding animals, which I imply on my Fishes too ofcourse. They&apos;re treated like babies here, and that&apos;s why you should choose me</p>
                </div>
            </div>
            <div className='flex flex-col md:flex-row  text-sm mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
                    <b>Quality Assurance:</b>
                    <p className="text-gray-600">We are committed to providing only the highest quality aquatic products and services. Every fish, plant, and accessory is carefully selected and inspected to ensure it meets our rigorous standards. Our focus is on delivering healthy, vibrant, and well-cared-for aquatic life, along with reliable equipment that enhances your aquarium experience. Your satisfaction and the well-being of your aquatic pets are our top priorities.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
                    <b>Convenience:</b>
                    <p className='text-gray-600'>We understand how important it is to have a seamless and hassle-free experience when it comes to your aquatic needs. From easy online ordering to timely delivery, we ensure that every step of the process is smooth and efficient. Our goal is to provide you with high-quality products and services right at your doorstep, saving you time and effort while ensuring your satisfaction.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
                    <b>Exceptional Customer Service:</b>
                    <p className='text-gray-600'>We prioritize your satisfaction above all else. Our team is dedicated to providing prompt, friendly, and knowledgeable support to address all your questions and concerns. Whether you need guidance on fish care, product recommendations, or assistance with an order, we are here to help. Your trust and happiness are our top priorities, and we strive to build lasting relationships with our customers through exceptional service.</p>
                </div>
            </div>
            <NewsLetterBox />
        </>
    )
}

export default About
