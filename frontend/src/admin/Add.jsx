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

const Update = () => {
    const [product, setProduct] = useState({
        images: [null, null, null, null],
        fishName: "",
        description: "",
        category: "",
        countInStock: 0,
        price: "",
        size: [],
        currentSize: '',
        bestSeller: false
    });

    const [originalProduct, setOriginalProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const navigate = useNavigate();
    const { Id } = useParams();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const { data } = useFetchProductByIdQuery(Id);

    useEffect(() => {
        if (data?.data) {
            setOriginalProduct(data.data);
            const imgPaths = data.data.images.map(img => img.path);
            const paddedImages = [...imgPaths, ...Array(4 - imgPaths.length).fill(null)];
            setProduct(prev => ({
                ...prev,
                fishName: data.data.fishName,
                description: data.data.description,
                price: data.data.price,
                countInStock: data.data.countInStock,
                category: data.data.category,
                size: data.data.size,
                bestSeller: data.data.bestSeller,
                images: paddedImages,
            }));
        }
    }, [data]);

    const handleImageChange = (index, file) => {
        setProduct(prev => {
            const newImages = [...prev.images];
            newImages[index] = file;
            return { ...prev, images: newImages };
        });
    };

    const handleAddSize = () => {
        const sizeValue = product.currentSize.trim();
        const numSize = Number(sizeValue);

        if (!sizeValue || isNaN(numSize)) {
            toast.info('Please enter a valid numeric size.');
        } else if (product.size.includes(numSize.toString())) {
            toast.info(`${numSize} Size already added.`);
        } else if (product.size.length >= 5) {
            toast.info('Only 5 sizes are allowed.');
        } else if (numSize === 0 && product.size.length > 0) {
            toast.info('0 size is only allowed alone.');
        } else if (product.size.includes('0')) {
            toast.info('0 size is already added and must be alone.');
        } else {
            setProduct(prev => ({
                ...prev,
                size: numSize === 0 ? ["0"] : [...prev.size, numSize.toString()],
                currentSize: ''
            }));
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            if (Id) {
                let hasChanges = false;

                // Compare fields and append only modified ones
                if (product.fishName !== originalProduct.fishName) {
                    formData.append("fishName", product.fishName);
                    hasChanges = true;
                }
                if (product.description !== originalProduct.description) {
                    formData.append("description", product.description);
                    hasChanges = true;
                }
                if (product.price !== originalProduct.price) {
                    formData.append("price", product.price);
                    hasChanges = true;
                }
                if (product.countInStock !== originalProduct.countInStock) {
                    formData.append("countInStock", product.countInStock);
                    hasChanges = true;
                }
                if (product.category !== originalProduct.category) {
                    formData.append("category", product.category);
                    hasChanges = true;
                }
                if (JSON.stringify(product.size) !== JSON.stringify(originalProduct.size)) {
                    formData.append("size", JSON.stringify(product.size));
                    hasChanges = true;
                }
                if (product.bestSeller !== originalProduct.bestSeller) {
                    formData.append("bestSeller", product.bestSeller);
                    hasChanges = true;
                }

                // Handle images (existing URLs + new Files)
                product.images.forEach(img => {
                    if (img) {
                        if (typeof img === 'string') {
                            formData.append("existingImages[]", img);
                        } else {
                            formData.append("file", img);
                        }
                        hasChanges = true;
                    }
                });

                if (!hasChanges) {
                    toast.info("No changes detected.");
                    return;
                }

                const response = await updateProduct({ id: Id, body: formData });

                if (response?.data?.success) {
                    toast.success(`${response.data.data.fishName} updated successfully.`);
                    navigate("/admin");
                } else {
                    toast.error(response?.error?.data?.message || "Update failed");
                }

            } else {
                // CREATE logic
                Object.entries(product).forEach(([key, value]) => {
                    if (key !== "images" && key !== "currentSize") {
                        formData.append(key, key === "size" ? JSON.stringify(value) : value);
                    }
                });

                product.images.forEach(image => {
                    if (image) formData.append("file", image);
                });

                const response = await createProduct(formData);

                if (response?.data?.success) {
                    toast.success(`${response.data.data.fishName} added successfully. Product form has been reset.`);
                    navigate("/admin");
                    setProduct({
                        images: [null, null, null, null],
                        fishName: "",
                        description: "",
                        countInStock: 0,
                        size: [],
                        price: "",
                        category: "",
                        currentSize: '',
                        bestSeller: false
                    });
                } else {
                    toast.error(response?.error?.data?.message || "Creation failed");
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
                                        : typeof image === "string"
                                            ? image
                                            : URL.createObjectURL(image)}
                                    alt=""
                                />
                                <input type="file" onChange={(e) => handleImageChange(index, e.target.files[0])} id={`image${index + 1}`} hidden />
                            </label>
                        ))}
                    </div>

                    <Input
                        type="text"
                        value={product.fishName}
                        required
                        label='Product Name'
                        onChange={(e) => setProduct(prev => ({ ...prev, fishName: e.target.value }))}
                    />

                    <Textarea
                        value={product.description}
                        label='Product Description'
                        onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                    />

                    <Select
                        label="Product Category"
                        value={product.category}
                        onChange={(val) => setProduct(prev => ({ ...prev, category: val }))}
                    >
                        {["Exotic fishes", "Aquarium Fishes", "Fresh Water Fishes", "Pond Fishes", "Monster Fishes", "Marine Fishes"].map(cat => (
                            <Option key={cat} value={cat}>{cat}</Option>
                        ))}
                    </Select>

                    <Input
                        type="number"
                        value={product.price}
                        required
                        label='Product Price'
                        onChange={(e) => setProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    />

                    <Input
                        type="number"
                        min={0}
                        required
                        value={product.countInStock}
                        label='Product Stock'
                        onChange={(e) => setProduct(prev => ({ ...prev, countInStock: Number(e.target.value) }))}
                    />

                    <div className='flex-wrap md:flex gap-2'>
                        <Input
                            type="number"
                            value={product.currentSize}
                            label='Product Sizes'
                            onChange={(e) => setProduct(prev => ({ ...prev, currentSize: e.target.value }))}
                        />
                        <div className="flex flex-col gap-2">
                            {product.size.map((size, index) => (
                                <div key={index} className='!flex items-center gap-2'>
                                    <IconButton
                                        type='button'
                                        color='red'
                                        onClick={() =>
                                            setProduct(prev => ({
                                                ...prev,
                                                size: product.size.filter(s => s !== size)
                                            }))
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
                            onChange={() => setProduct(prev => ({ ...prev, bestSeller: !prev.bestSeller }))}
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