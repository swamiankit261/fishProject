// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { assets } from '../assets/admin_assets/assets'
import { toast } from 'react-toastify'
import Sidebar from './components/Sidebar';
import { useCreateProductMutation } from "../redux/api/product"
import { useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@material-tailwind/react';
const Add = () => {
    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("Men")
    const [countInStock, setCountInStock] = useState()
    const [price, setPrice] = useState(false)
    const [sizes, setSizes] = useState([])
    const [currentSize, setCurrentSize] = useState('');
    const [bestSeller, setBestSeller] = useState(false);


    const navigate = useNavigate();


    const [createProduct, { isLoading }] = useCreateProductMutation();


    const onsubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("fishName", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("countInStock", countInStock)
            formData.append("category", category)
            formData.append("bestSeller", bestSeller)
            formData.append("size", sizes.map(size => `${size}`))
            if (image1) formData.append("file", image1);
            if (image2) formData.append("file", image2);
            if (image3) formData.append("file", image3);
            if (image4) formData.append("file", image4);

            const response = await createProduct(formData);
            if (!isLoading) {
                console.info(response);
                if (response.error) {
                    toast.error(response?.error?.data.message)
                    return;
                } else if (response?.data?.success) {
                    toast.success(`${response.data.data.fishName} 🐟fish added successfully.`);
                    navigate("/admin")
                    setName("")
                    setDescription("")
                    setCountInStock(0)
                    setSizes([])
                    setImage1(false)
                    setImage2(false)
                    setImage3(false)
                    setImage4(false)
                    setPrice("")
                }
            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    const handleAddSize = () => {
        if (currentSize && !isNaN(currentSize) && currentSize > 0) {
            if (sizes.some(handle => handle === currentSize)) {
                toast.info(`${currentSize} Size already added.`);
            } else if (sizes.length >= 5) {
                toast.info(`only 5 size is allowed.`)
            } else {
                setSizes((prevSizes) => [...prevSizes, currentSize]);
                setCurrentSize('');
            }
        } else {
            toast.info('Please enter a valid size.');
        }
    };


    return (
        <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base '>

                <form onSubmit={onsubmitHandler} className='flex flex-col w-full items-start gap-3'>
                    <div>
                        <p className='mb-2'>Upload image</p>
                        <div className='flex gap-3'>
                            <label htmlFor="image1">
                                <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                                <input type="file" onChange={(e) => setImage1(e.target.files[0])} id='image1' hidden />
                            </label>

                            <label htmlFor="image2">
                                <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
                                <input type="file" onChange={(e) => setImage2(e.target.files[0])} id='image2' hidden />
                            </label>

                            <label htmlFor="image3">
                                <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
                                <input type="file" id='image3' onChange={(e) => setImage3(e.target.files[0])} hidden />
                            </label>

                            <label htmlFor="image4">
                                <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
                                <input type="file" id='image4' onChange={(e) => setImage4(e.target.files[0])} hidden />
                            </label>
                        </div>

                    </div>

                    <div className='w-full'>
                        <p className='mb-2'>Product name</p>
                        <input className='w-full max-w-[500px] px-3  py-2' onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Type here' required />
                    </div>

                    <div className='w-full'>
                        <p className='mb-2'>Product desc</p>
                        <textarea className='w-full max-w-[500px] px-3  py-2' onChange={(e) => setDescription(e.target.value)} value={description} type="text" placeholder='Write content here' required />
                    </div>

                    <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                        <div>
                            <p className='mb-2'>Product Category</p>
                            <select className='w-full px-3 py-2' onChange={(e) => setCategory(e.target.value)}>
                                {['Exotic fishes', 'Aquarium Fishes', 'Fresh Water Fishes', 'Pond Fishes', 'Monster Fishes', 'Marien Fishes'].map((category) => {

                                    return <option key={category} value={category}>{category}</option>
                                })}
                            </select>
                        </div>

                        <div>
                            <p className='mb-2'>Product Price</p>
                            <input className='w-full px-3 py-2 sm:w-[120px]' value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder='price' />
                        </div>

                    </div>
                    <div>
                        <p className='mb-2'>Product Sizes</p>
                        <input
                            className='w-full px-3 py-2 sm:w-[120px] mr-2'
                            value={currentSize}
                            min={0}
                            onChange={(e) => setCurrentSize(e.target.value)}
                            type="number"
                            placeholder='5'
                        />
                        <Button type='button'
                            className=''
                            size='sm'
                            onClick={handleAddSize}
                        >
                            Add sizes
                        </Button>
                    </div>
                    <div>
                        <h3>Added Sizes:</h3>
                        <div className="flex">
                            {sizes.map((siz, i) => (
                                <IconButton className='mb-2 bg-red-300 mr-2 p-1 rounded' key={i}>{siz}</IconButton>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className='mb-2'>Product stock</p>
                        <input className='w-full px-3 py-2 sm:w-[120px]' required value={countInStock} onChange={(e) => setCountInStock(e.target.value)} type="number" placeholder='stock' />
                    </div>
                    <div className='flex gap-2 mt-2'>
                        <input onChange={() => { setBestSeller(pre => !pre) }} checked={bestSeller} type="checkbox" name="bestSeller" id="bestSeller" />
                        <label className='cursor-pointer' htmlFor="bestSeller">Add to best seller</label>
                    </div>
                    {isLoading ? <Button type="submit" className="bg-black text-white px-16 py-3 text-sm mt-4 ..." >
                        Processing <span className='bg-yellow-400 animate-bounce ml-1 p-1 rounded-full inline-flex'></span>
                        <span className='bg-green-400 p-1 mx-1 animate-bounce rounded-full inline-flex'></span>
                        <span className='bg-green-400 p-1 animate-bounce rounded-full inline-flex'></span>
                    </Button>
                        :
                        <Button
                            type="submit"
                            className="bg-black text-white px-16 py-3 text-sm mt-4"
                        // disabled={isSubmitting}
                        >
                            submit
                        </Button>}
                    {/* <button className='w-28 py-3 mt-4 bg-black text-white'>submit</button> */}
                </form>

            </div>
        </div>
    )
}

export default Add