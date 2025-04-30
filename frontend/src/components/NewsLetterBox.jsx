// eslint-disable-next-line no-unused-vars
import React from 'react'

const NewsLetterBox = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault()
    }
    return (
        <div className='text-center mt-6'>
            <p className='text-2xl text-gray-800 font-medium'>Subscribe our channels</p>
            {/* <p className='text-gray-400 mt-3'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id, corporis?</p> */}
            <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex text-center gap-3 mx-auto my-6 rounded-lg pl-3 '>
                <a href='https://www.youtube.com/@WildlyIndian' className='bg-black text-white text-xs px-10 py-4 rounded-lg mx-auto animate-bounce' target='_blank'>Subscribe new</a>
                {/* <input className='w-full sm-flex-1 outline-none' readOnly value={'https://www.youtube.com/@WildlyIndian'} required type="email" placeholder='Enter your Email' /> */}
                {/* <button type='submit' className='bg-black text-white text-xs px-10 py-4 '>subscribe</button> */}
            </form>
        </div>
    )
}
export default NewsLetterBox