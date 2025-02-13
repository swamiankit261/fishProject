import { useEffect, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/Productitem'
import { useFetchProductsQuery } from '../redux/api/product'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '../redux/features/product/productSlice'
import { Button } from '@material-tailwind/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import PriceRangeSlider from '../components/PriceRangeSlider'
const Collection = () => {
    const [category, setCategory] = useState();
    const [sortType, setSortType] = useState("createdAt:desc");
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [filter, setFilter] = useState(false);
    // const [limit, setLimit] = useState(12);
    const [rangeValues, setRangeValues] = useState({ min: 0, max: 15000 });


    const dispatch = useDispatch();
    const { productList } = useSelector((store) => store.products);

    // Construct query parameters dynamically
    const queryParams = new URLSearchParams();

    if (category) queryParams.append("category", category);
    queryParams.append("page", activePage);
    if (rangeValues?.checked) queryParams.append("maxPrice", rangeValues.max)
    if (rangeValues?.checked) queryParams.append("minPrice", rangeValues.min)
    // queryParams.append("limit", limit);
    queryParams.append("sort", sortType);

    // Convert queryParams to a string
    const queryString = queryParams.toString();

    // console.log(queryString);

    const { data, refetch } = useFetchProductsQuery(queryString);

    // console.log(data.data);

    const fatchProduct = () => {
        if (data?.data) {
            dispatch(setProducts(data))
            setTotalPages(data?.data.totalPages)
            setActivePage(data?.data.currentPage)
        }
    }

    useEffect(() => {
        fatchProduct()
    }, [data]);

    const toggleCategory = (e) => {
        if (e.target.value === category) {
            setCategory("")
        } else {

            setCategory(e.target.value)
        }

    };


    function debounce(functionToCall, interval = 300) {
        let timeOutId
        return function (...args) {
            const context = this
            clearTimeout(timeOutId)
            timeOutId = setTimeout(() => {
                functionToCall.apply(context, args)
            }, interval)
        }
    }

    const prev = () => {
        if (activePage > 1) setActivePage((prevPage) => prevPage - 1);
    };

    const next = () => {
        if (activePage < totalPages) setActivePage((prevPage) => prevPage + 1);
    };

    const handlePageClick = (page) => {
        setActivePage(page);
        refetch()
    };

    const handleRengeChange = (value) => {
        setRangeValues(v => ({ ...v, ...value }))
    }

    const handlePriceFilter = (e) => {
        setRangeValues(v => ({ ...v, checked: e.target.checked }));
    }
    return (
        <>
            <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
                {/* Filter options */}
                <div className='min-w-60'>
                    <p className='text-xl mt-2 flex item-center cursor-pointer gap-2' onClick={() => setFilter(!filter)}>FILTERS
                        <img className={`h-3 mt-2 ${filter ? "transition-transform duration-300 ease-linear origin-center rotate-90" : "transition-transform duration-300 ease-linear origin-center rotate-0"}`} src={assets.dropdown_icon} alt="" />
                    </p>
                    {/* Category filter */}
                    <div className={`border border-gray-300 pl-5 py-3 mt-6 ${filter ? "hidden transition-all duration-700 ease-linear" : "sm:block transition-all duration-700 ease-linear"}`}>
                        <p className='mb-3 text-sm font-medium '>CATEGORIES</p>
                        {['Exotic fishes', 'Aquarium Fishes', 'Fresh Water Fishes', 'Pond Fishes', 'Monster Fishes', 'Marien Fishes'].map(categoryItem => (
                            <p key={categoryItem} className='flex gap-2'>
                                <input
                                    className='w-3'
                                    id={categoryItem}
                                    value={categoryItem}
                                    type="checkbox"
                                    checked={categoryItem === category}
                                    onChange={toggleCategory}
                                />
                                <label className='cursor-pointer' htmlFor={categoryItem}>{categoryItem}</label>
                            </p>
                        ))}
                    </div>
                    {/* Subcategory filter */}
                    <div className={`border border-gray-300 pl-1 py-3 mt-6 hidden sm:block`}>
                        <p className='mb-3 text-sm font-medium pl-2 flex gap-2'><input type="checkbox" id='price' onChange={handlePriceFilter} /> <label htmlFor='price' className='cursor-pointer'>PRICE</label></p>
                        {/* <div className='flex flex-col gap-2 text-sm font-light text-gray-700'> */}
                        <PriceRangeSlider min={50} max={15000} currencyText={"₹"} onChange={debounce(handleRengeChange)} />
                        {/* </div> */}
                    </div>
                </div>

                {/* Right side content */}
                <div className='flex-1'>
                    <div className='flex justify-between text-base sm:text-2xl mb-4'>
                        <Title text1={"ALL"} text2={"COLLECTIONS"} />
                        <select onChange={(e) => { setSortType(`${e.target.value}`) }} className='border-2 border-gray-300 text-sm px-2'>
                            <option value="createdAt:desc">Sort by Date : New to old</option>
                            <option value="createdAt:incre">Sort by Date : Old to New</option>
                            <option value="price:desc">Sort by Price : High to Low</option>
                            <option value="price:incre">Sort by Price: Low to High</option>
                        </select>
                    </div>
                    {/* Map products */}
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                        {productList.map(item => (
                            <ProductItem key={item._id} id={item._id} image={item.images[0].path} name={item.fishName} category={item.category} price={item.price} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-10 mx-auto">
                {totalPages > 1 && <div className="flex flex-wrap items-center justify-center gap-2 mx-auto w-full sm:w-3/4 lg:w-1/2">
                    {/* Previous Button */}
                    <Button
                        variant="text"
                        className="flex items-center gap-2"
                        onClick={prev}
                        disabled={activePage === 1}
                    >
                        <ArrowLeftIcon strokeWidth={3} className="w-4 sm:w-5" /> Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;
                            return (
                                <Button
                                    key={page}
                                    ripple={true}
                                    className={`px-3 py-1 ${activePage === page
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-800"
                                        }`}
                                    size="sm"
                                    onClick={() => handlePageClick(page)}
                                >
                                    {page}
                                </Button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="text"
                        className="flex items-center gap-2"
                        onClick={next}
                        disabled={activePage === totalPages}
                    >
                        Next
                        <ArrowRightIcon strokeWidth={3} className="w-4 sm:w-5" />
                    </Button>
                </div>}
            </div>
        </>
    )
}

export default Collection
