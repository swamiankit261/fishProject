import { Link } from 'react-router-dom'

const ProductItem = (props) => {

    const { id, image, name, price, category } = props || {};
    
    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden'>
                <img
                    className='hover:scale-110 transition ease-in-out'
                    src={image || '/path/to/placeholder-image.jpg'}
                    alt={name}
                />
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}  ( {category} )</p>
            <p className='text-sm font-medium'>
                ₹ {new Intl.NumberFormat('en-IN', { style: 'decimal', maximumFractionDigits: 2 }).format(price)}
            </p>
        </Link>
    )
}

export default ProductItem
