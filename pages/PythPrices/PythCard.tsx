import Image, { StaticImageData } from 'next/image'
import React from 'react'

interface PythCardProps {
  name: string
  price: string
  image1: StaticImageData
  image2: StaticImageData
}

const PythCard = ({ image1, image2, name, price }: PythCardProps) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg cursor-pointer">
      <div className="flex justify-center h-32 relative">
        <Image className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16" src={image1} alt="Image 1" />
        <Image className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 -mt-4 -ml-8" src={image2} alt="Image 2" />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-4xl mb-2">{name.toLocaleUpperCase()}</div>
        <p className="text-gray-200 text-4xl">{price}</p>
      </div>
    </div>
  )
}

export default PythCard
