import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import { useDeleteProductMutation, useFatchProductByAdminQuery } from '../../redux/api/product';
import { useDispatch } from 'react-redux';
import { setAdminProducts } from '../../redux/features/product/productSlice';
import { Button } from '@material-tailwind/react';
import { NavLink } from 'react-router-dom';
import Title from '../../components/Title';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { CiEdit } from "react-icons/ci";

const List = () => {
    const [list, setList] = useState([]);
    const dispatch = useDispatch();
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState();

    const queryParams = new URLSearchParams();

    queryParams.append("page", activePage);

    const { currentData, refetch, isLoading: fatchLoading } = useFatchProductByAdminQuery(queryParams.toString());
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();



    // Fetch and populate the list
    const fetchList = async () => {
        if (currentData && !fatchLoading) {
            setTotalPages(currentData?.totalPages)
            setList(currentData?.results || []);
            dispatch(setAdminProducts(currentData));
        }
    };

    // Remove a product
    const removeProduct = async (id) => {
        try {
            // Simulate API call
            const response = await deleteProduct(id).unwrap();

            if (response.success) {
                console.log(response);
                refetch()
                toast.info(`${response.message}`);
                setList((prevList) => prevList.filter((item) => item._id !== id));
            }
        } catch (error) {
            toast.error(error.message || 'Failed to remove product');
        }
    };

    useEffect(() => {
        fetchList();
    }, [currentData]);


    // Handlers for previous and next buttons
    const prevAndNextPages = (value) => {
        if (value === "prev") {
            if (activePage > 1) setActivePage((prevPage) => prevPage - 1);
        } else {
            if (activePage < totalPages) setActivePage((prevPage) => prevPage + 1);
        }
    };

    return (
        <>
            <div className="flex w-full">
                <Sidebar />
                <div className="sm:w-[70%] w-full mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                    <div className="flex justify-between flex-wrap mb-2">
                        <Title text1={"ALL"} text2={"Products List"} />
                        <div className="flex gap-2">
                            <Button
                                variant="text"
                                className="flex items-center gap-2"
                                onClick={() => prevAndNextPages("prev")}
                                disabled={activePage === 1}
                            >
                                <ArrowLeftIcon strokeWidth={3} className="w-4 sm:w-5" /> Previous
                            </Button>
                            <Button
                                variant="text"
                                className="flex items-center gap-2"
                                onClick={() => prevAndNextPages("next")}
                                disabled={activePage === totalPages}
                            >
                                Next
                                <ArrowRightIcon strokeWidth={3} className="w-4 sm:w-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center py-2 px-1 border bg-gray-100 text-sm">
                        <b >Image</b>
                        <b>Name</b>
                        <b>Category</b>
                        <b>Stock</b>
                        <b>Price</b>
                        <b>Edit Product</b>
                        <b className="text-center">Delete Action</b>
                    </div>

                    {list && list.length > 0 ? (
                        list.map((item, index) => (
                            <div
                                className="grid grid-col-[1fr_2fr_1fr_1fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
                                key={index}
                            >
                                <div className="bg-blue-gray-500 w-12 ">
                                    <NavLink to={`/product/${item?._id}`}>
                                        <img
                                            className="w-12 hover:scale-110 cursor-pointer"
                                            src={item?.images?.[0]?.path || ''}
                                            alt=""
                                        />
                                    </NavLink>
                                </div>
                                <p className='bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-lg text-transparent'>{item?.fishName || 'N/A'}</p>
                                <p>{item?.category || 'N/A'}</p>
                                <p>{item?.countInStock || <span className='text-red-500'>N/A</span>}</p>
                                <p>{item?.price || 'N/A'}</p>
                                <NavLink
                                    to={`/admin/add/${item?._id}`}
                                    className=" align-middle text-center m-auto hover:text-green-600"
                                >
                                    <CiEdit className='text-xl m-auto' />
                                </NavLink>
                                <Button
                                    loading={isLoading}
                                    size="sm"
                                    className="w-10 align-middle m-auto hover:text-red-500"
                                    onClick={() => item?._id && removeProduct(item._id)}
                                >
                                    X
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No products found</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default List;
