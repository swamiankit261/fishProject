import { NavLink } from 'react-router-dom'

const ProductItem = (props) => {

    const { id, image, name, price, category } = props || {};

    <NavLink className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
        <div className="relative flex flex-wrap flex-col my-6 mx-auto bg-white shadow-sm border border-slate-200 rounded-lg w-52 md:w-56" >
            <div className="relative p-2.5 h-64 overflow-hidden rounded-xl bg-clip-border">
                <img
                    src={image || '/path/to/placeholder-image.jpg'}
                    alt={name}
                    className="h-full w-full object-cover rounded-md hover:scale-105 transition ease-in-out"
                />
            </div>
            <div className="p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between">
                    <p className="text-slate-800 text-wrap text-xl font-semibold">
                        {name}
                    </p>
                    <p className="text-cyan-600 text-xl font-semibold text-nowrap">
                        ₹ {new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 2 }).format(price)}
                    </p>
                </div>
                <p className="text-slate-600 leading-normal font-light">
                    {category}
                </p>
            </div>
        </div >
    </NavLink>

    return (
        <NavLink className='text-gray-700 cursor-pointer hover:shadow border border-slate-200 p-2 rounded-lg' to={`/product/${id}`}>
            <div className='overflow-hidden'>
                <img
                    className='hover:scale-110 transition rounded-md ease-in-out'
                    src={image || '/path/to/placeholder-image.jpg'}
                    alt={name}
                />
            </div>
            <div className="mt-2">
                <div className="mb-2 flex flex-wrap items-center justify-between">
                    <p className="text-slate-800 text-wrap text-xl font-semibold">
                        {name}
                    </p>
                    <p className="text-cyan-600 text-xl font-semibold text-nowrap">
                        ₹ {new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 2 }).format(price)}
                    </p>
                </div>
                <p className="text-slate-600 leading-normal font-light">
                    ( {category} )
                </p>
            </div>
        </NavLink>
    )
}

export default ProductItem
