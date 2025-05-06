import { useEffect, useState } from 'react';
import { assets } from '../assets/admin_assets/assets';
import { toast } from 'react-toastify';
import Sidebar from './components/Sidebar';
import {
    useCreateProductMutation,
    useFetchProductByIdQuery,
    useUpdateProductMutation
} from '../redux/api/product';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    IconButton,
    Input,
    Option,
    Select,
    Textarea
} from '@material-tailwind/react';
import { skipToken } from '@reduxjs/toolkit/query';

const initialProduct = {
    images: [null, null, null, null],
    fishName: '',
    description: '',
    category: '',
    countInStock: 0,
    price: '',
    size: [],
    currentSize: '',
    bestSeller: false
};

const categories = [
    "Exotic fishes", "Aquarium Fishes", "Fresh Water Fishes", "Pond Fishes",
    "Monster Fishes", "Marine Fishes"
];

const Update = () => {
    const [product, setProduct] = useState(initialProduct);
    const [originalProduct, setOriginalProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { Id } = useParams();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const { data } = useFetchProductByIdQuery(Id || skipToken);



    useEffect(() => {
        if (data?.data) {
            const { images, ...rest } = data.data;
            const paddedImages = [...images.map(img => img.path), ...Array(4 - images.length).fill(null)];
            setProduct({ ...rest, images: paddedImages, currentSize: '' });
            setOriginalProduct(data.data);
        }
    }, [data]);

    const updateProductField = (field, value) => {
        setProduct(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (index, file) => {
        const newImages = [...product.images];
        newImages[index] = file;
        updateProductField('images', newImages);
    };

    const handleAddSize = () => {
        const sizeValue = product.currentSize.trim();
        const numSize = Number(sizeValue);

        if (!sizeValue || isNaN(numSize)) {
            toast.info('Please enter a valid numeric size.');
            return;
        }

        const sizeStr = numSize.toString();

        if (product.size.includes(sizeStr)) {
            toast.info(`${sizeStr} size already added.`);
        } else if (product.size.length >= 5) {
            toast.info('Only 5 sizes are allowed.');
        } else if (numSize === 0 && product.size.length > 0) {
            toast.info('0 size is only allowed alone.');
        } else if (product.size.includes('0')) {
            toast.info('0 size is already added and must be alone.');
        } else {
            updateProductField('size', numSize === 0 ? ['0'] : [...product.size, sizeStr]);
            updateProductField('currentSize', '');
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            if (Id) {
                let hasChanges = false;

                const fieldsToCheck = ['fishName', 'description', 'price', 'countInStock', 'category', 'bestSeller'];
                fieldsToCheck.forEach(field => {
                    if (product[field] !== originalProduct[field]) {
                        formData.append(field, product[field]);
                        hasChanges = true;
                    }
                });

                if (JSON.stringify(product.size) !== JSON.stringify(originalProduct.size)) {
                    formData.append('size', JSON.stringify(product.size));
                    hasChanges = true;
                }

                product.images.forEach(img => {
                    if (img) {
                        formData.append(typeof img === 'string' ? 'existingImages[]' : 'file', img);
                        hasChanges = true;
                    }
                });

                if (!hasChanges) {
                    toast.info('No changes detected.');
                    return;
                }

                const response = await updateProduct({ id: Id, body: formData });

                if (response?.data?.success) {
                    toast.success(`${response?.data?.data.fishName} updated successfully.`);
                    navigate('/admin');
                } else {
                    toast.error(response?.error?.data?.message || 'Update failed.');
                }
            } else {
                // Create new product
                Object.entries(product).forEach(([key, value]) => {
                    if (key !== 'images' && key !== 'currentSize') {
                        formData.append(key, key === 'size' ? JSON.stringify(value) : value);
                    }
                });

                product.images.forEach(image => {
                    if (image) formData.append('file', image);
                });

                const response = await createProduct(formData);

                if (response?.data?.success) {
                    toast.success(`${response?.data?.data.fishName} added successfully.`);
                    navigate('/admin');
                    setProduct(initialProduct);
                } else {
                    toast.error(response?.error?.data?.message || 'Creation failed.');
                }
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
                    <p className='mb-2'>Upload Images</p>
                    <div className='flex gap-3'>
                        {product.images.map((image, index) => (
                            <label key={index} htmlFor={`image${index + 1}`}>
                                <img
                                    className='w-20'
                                    src={!image
                                        ? assets.upload_area
                                        : typeof image === 'string'
                                            ? image
                                            : URL.createObjectURL(image)}
                                    alt=""
                                />
                                <input type="file" onChange={(e) => handleImageChange(index, e.target.files[0])} id={`image${index + 1}`} hidden />
                            </label>
                        ))}
                    </div>

                    <Input type="text" required label='Product Name' value={product.fishName}
                        onChange={(e) => updateProductField('fishName', e.target.value)} />

                    <Textarea label='Product Description' value={product.description}
                        onChange={(e) => updateProductField('description', e.target.value)} />

                    <Select label="Product Category" value={product.category}
                        onChange={(val) => updateProductField('category', val)}>
                        {categories.map(cat => (
                            <Option key={cat} value={cat}>{cat}</Option>
                        ))}
                    </Select>

                    <Input type="number" required label='Product Price' value={product.price}
                        onChange={(e) => updateProductField('price', Number(e.target.value))} />

                    <Input type="number" min={0} required label='Product Stock' value={product.countInStock}
                        onChange={(e) => updateProductField('countInStock', Number(e.target.value))} />

                    <div className='flex-wrap md:flex gap-2'>
                        <Input
                            type="number"
                            label='Product Sizes'
                            value={product.currentSize}
                            onChange={(e) => updateProductField('currentSize', e.target.value)}
                        />
                        <div className="flex flex-col gap-2">
                            {product.size.map((size, index) => (
                                <div key={index} className='!flex items-center gap-2'>
                                    <IconButton
                                        type='button'
                                        color='red'
                                        onClick={() =>
                                            updateProductField('size', product.size.filter(s => s !== size))
                                        }>
                                        <p>{size}</p>
                                    </IconButton>
                                </div>
                            ))}
                            <Button type='button' className='bg-green-500' size='sm' onClick={handleAddSize}>Add Size</Button>
                        </div>
                    </div>

                    <div className='flex gap-2 mt-2'>
                        <input
                            type="checkbox"
                            checked={product.bestSeller}
                            onChange={() => updateProductField('bestSeller', !product.bestSeller)}
                            id="bestSeller"
                        />
                        <label htmlFor="bestSeller">Add to best seller</label>
                    </div>

                    <Button
                        type="submit"
                        className="bg-black text-white px-16 py-3 text-sm mt-4"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Processing..." : "Submit"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Update;