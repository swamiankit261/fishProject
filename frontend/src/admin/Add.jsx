// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { assets } from '../assets/admin_assets/assets'
import { toast } from 'react-toastify'
import Sidebar from './components/Sidebar';
import { useCreateProductMutation } from "../redux/api/product"
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, Input, Option, Select, Textarea } from '@material-tailwind/react';
const Add = () => {
    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [countInStock, setCountInStock] = useState()
    const [price, setPrice] = useState()
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
        const sizeValue = currentSize.trim();
        const numSize = Number(sizeValue);

        switch (true) {
            case !sizeValue || isNaN(numSize):
                toast.info('Please enter a valid numeric size.');
                break;

            case sizes.includes(numSize.toString()):
                toast.info(`${numSize} Size already added.`);
                break;

            case sizes.length >= 5:
                toast.info('Only 5 sizes are allowed.');
                break;

            case numSize === 0 && sizes.length > 0:
                toast.info('0 size is only allowed alone.');
                break;

            case sizes.includes('0'):
                toast.info('0 size is already added and must be alone.');
                break;

            default:
                setSizes(numSize === 0 ? ["0"] : [...sizes, numSize.toString()]);
                break;
        }

        setCurrentSize('');
    };


    return (
        isLoading == true ? (<div className='flex w-full'>
            <Sidebar /> {/* Assuming Sidebar has its own skeleton */}
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 animate-pulse'>
                {/* Image Upload Section */}
                <div className='flex flex-col gap-3 mb-6'>
                    <div className='h-4 bg-gray-200 w-24 mb-2 rounded'></div>
                    <div className='flex gap-3'>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className='w-20 h-20 bg-gray-200 rounded'></div>
                        ))}
                    </div>
                </div>

                {/* Product Name */}
                <div className='mb-6'>
                    <div className='h-4 bg-gray-200 w-32 mb-2 rounded'></div>
                    <div className='h-8 bg-gray-200 w-full max-w-[500px] rounded'></div>
                </div>

                {/* Product Description */}
                <div className='mb-6'>
                    <div className='h-4 bg-gray-200 w-32 mb-2 rounded'></div>
                    <div className='h-20 bg-gray-200 w-full max-w-[500px] rounded'></div>
                </div>

                {/* Category & Price Row */}
                <div className='flex flex-col sm:flex-row gap-8 mb-6'>
                    <div className='flex-1'>
                        <div className='h-4 bg-gray-200 w-32 mb-2 rounded'></div>
                        <div className='h-10 bg-gray-200 rounded'></div>
                    </div>
                    <div>
                        <div className='h-4 bg-gray-200 w-32 mb-2 rounded'></div>
                        <div className='h-10 bg-gray-200 w-[120px] rounded'></div>
                    </div>
                </div>

                {/* Sizes Section */}
                <div className='mb-6'>
                    <div className='h-4 bg-gray-200 w-32 mb-2 rounded'></div>
                    <div className='flex gap-2'>
                        <div className='h-10 bg-gray-200 w-[120px] rounded'></div>
                        <div className='h-10 bg-gray-200 w-20 rounded'></div>
                    </div>
                    <div className='flex mt-2'>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className='w-8 h-8 bg-gray-200 rounded-full mr-2'></div>
                        ))}
                    </div>
                </div>

                {/* Stock */}
                <div className='mb-6'>
                    <div className='h-4 bg-gray-200 w-32 mb-2 rounded'></div>
                    <div className='h-10 bg-gray-200 w-[120px] rounded'></div>
                </div>

                {/* Best Seller */}
                <div className='flex gap-2 mt-2 mb-6'>
                    <div className='w-4 h-4 bg-gray-200 rounded'></div>
                    <div className='h-4 bg-gray-200 w-32 rounded'></div>
                </div>

                {/* Submit Button */}
                <div className='h-12 bg-gray-200 w-32 rounded'></div>
            </div>
        </div>)
            :
            (
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

                            <div className='w-1/2'>
                                <Input
                                    type="text"
                                    className='focus:border-purple-500 focus:border-t-transparent'
                                    value={name}
                                    label='Product name'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className='w-1/2'>
                                {/* <p className='mb-2'>Product desc</p> */}
                                <Textarea
                                    onChange={(e) => setDescription(e.target.value)} value={description}
                                    className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border  border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                                    label='Product description'
                                    placeholder=" " />
                                {/* <textarea className='w-full max-w-[500px] px-3  py-2' onChange={(e) => setDescription(e.target.value)} value={description} type="text" placeholder='Write content here' required /> */}
                            </div>

                            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                                <div>
                                    <Select label="Product Category" defaultValue={category} className='focus:border-purple-500 focus:border-t-transparent'>
                                        {["Exotic fishes", "Aquarium Fishes", "Fresh Water Fishes", "Pond Fishes", "Monster Fishes", "Marien Fishes",].map((cat) => (
                                            <Option key={cat} onClick={() => setCategory(cat)}>
                                                {cat}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <Input
                                        className='focus:border-purple-500 focus:border-t-transparent'
                                        type="number"
                                        value={price}
                                        label='Product Price'
                                        max={15000}
                                        onChange={(e) => setPrice(Number(e.target.value))}

                                    />


                                </div>

                            </div>
                            <div>
                                <div className="flex gap-2">
                                    <div className="">
                                        <Input
                                            className='focus:border-purple-500 focus:border-t-transparent'
                                            type="number"
                                            value={currentSize}
                                            label='Product Sizes'
                                            onChange={(e) => setCurrentSize(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-4 sm:mt-0">
                                        <Button type='button'
                                            className='bg-green-500'
                                            size='sm'
                                            onClick={handleAddSize}
                                        >
                                            Add sizes
                                        </Button>
                                        <Button type='button'
                                            className='bg-red-600'
                                            size='sm'
                                            onClick={() => { if (sizes.length > 0) { setSizes([]); toast.info(`Sizes removed successfully.`) } }}
                                        >
                                            Remove sizes
                                        </Button>
                                    </div>
                                </div>
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
                                {/* <p className='mb-2'>Product stock</p> */}
                                <Input
                                    className='focus:border-purple-500 focus:border-t-transparent'
                                    type="number"
                                    value={countInStock}
                                    label='Product stock'
                                    onChange={(e) => setCountInStock(e.target.value)}
                                />
                                {/* <input className='w-full px-3 py-2 sm:w-[120px]' required value={countInStock} onChange={(e) => setCountInStock(e.target.value)} type="number" placeholder='stock' /> */}
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

    )
}

export default Add