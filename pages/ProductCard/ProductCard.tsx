import Image, { StaticImageData } from 'next/image'
import React from 'react'

interface ProductCardProps {
  image: StaticImageData
  name: string
  price: string
}

const ProductCard = ({ image, name, price }: ProductCardProps) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg cursor-pointer">
      <div className="flex justify-center h-48 relative">
        <Image className="w-full absolute inset-0 h-full object-cover object-center" src={image} alt={name} />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name.toLocaleUpperCase()}</div>
        <p className="text-gray-700 text-base">{price}</p>
      </div>
    </div>
  )
}

export default ProductCard
