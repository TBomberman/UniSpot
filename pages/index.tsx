import Image from 'next/image'
import { IBM_Plex_Mono } from 'next/font/google'
import Logo from '@/assets/logo.png'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { BsArrowRight } from 'react-icons/bs'
import { RxDashboard } from 'react-icons/rx'
import { IoWalletOutline, IoNotificationsOutline } from 'react-icons/io5'
import { TbArrowsExchange } from 'react-icons/tb'
import { RiExchangeFundsLine } from 'react-icons/ri'
// import PriceChart from '@/components/PriceChart'
// import price from '@/config/Prices.json'
import ProductList from './ProductCard/ProductList'
import pyth from '../assets/pyth.png'
import PythList from './PythPrices/PythList'
import { useState } from 'react'

const inter = IBM_Plex_Mono({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

export default function Home() {
  const [isPyth, setIsPyth] = useState(false)

  const changeLink = (state: boolean) => {
    setIsPyth(state)
  }
  return (
    <main className={`flex w-full ${inter.className}`}>
      <div className={'min-h-screen w-1/4 bg-[#1E1F20] px-8 py-10'}>
        <div className={'mb-8 flex gap-2 justify-center items-center'}>
          <Image src={Logo} alt={'Logo'} className={'w-8 h-8'} />
          <h1 className={'font-bold text-white text-3xl text-center'}>
            <span className={'text-[#6271EB]'}>Uni</span>Spot
          </h1>
        </div>
        <div>
          <div className={'text-white py-3 px-6 rounded-xl cursor-pointer'}>
            <div className={'flex items-center gap-2'}>
              <HiOutlineUserCircle />
              Profile
            </div>
          </div>
          <div
            className={`text-white py-3 px-6 rounded-xl cursor-pointer ${!isPyth ? 'flex justify-between items-center bg-[#6271EB]' : ''}`}
            onClick={() => {
              changeLink(false)
            }}
          >
            <div className={'flex items-center gap-2'}>
              <RxDashboard />
              UniSpot
            </div>
            {!isPyth && <BsArrowRight />}
          </div>
          <div
            className={`text-white py-2 px-6 rounded-xl cursor-pointer -pl-3 ${isPyth ? 'flex justify-between items-center bg-[#6271EB]' : ''}`}
            onClick={() => {
              changeLink(true)
            }}
          >
            <div className={'flex items-center gap-2'}>
              <Image src={pyth} alt={'pyth'} className={'w-8 h-8'} />
              <span className={'-ml-2'}>Pyth</span>
            </div>
            {isPyth && <BsArrowRight />}
          </div>
          <div className={'text-white py-3 px-6 rounded-xl cursor-pointer'}>
            <div className={'flex items-center gap-2'}>
              <IoWalletOutline />
              Wallet
            </div>
          </div>
          <div className={'text-white py-3 px-6 rounded-xl cursor-pointer'}>
            <div className={'flex items-center gap-2'}>
              <TbArrowsExchange />
              Trade
            </div>
          </div>
          <div className={'text-white py-3 px-6 rounded-xl cursor-pointer'}>
            <div className={'flex items-center gap-2'}>
              <IoNotificationsOutline />
              Notifications
            </div>
          </div>
          <div className={'text-white py-3 px-6 rounded-xl cursor-pointer'}>
            <div className={'flex items-center gap-2'}>
              <RiExchangeFundsLine />
              Exhanges
            </div>
          </div>
        </div>
      </div>
      <div className={'w-3/4 bg-[#121212] py-10 px-8'}>
        {!isPyth && (
          <>
            <div className={'flex w-full justify-between items-center mb-8'}>
              <div className={'text-4xl font-bold mb-2 text-zinc-600'}>
                <p >UniSpot Prices on Injective</p>
              </div>
            </div>
            <div className="container mx-auto px-4 py-8">
              <ProductList />
            </div>
          </>
        )}
        {isPyth && (
          <>
            <div className={'flex w-full justify-between items-center mb-8'}>
              <div className={'text-4xl font-bold mb-2 text-zinc-600'}>
                <p>Pyth Prices on Injective</p>
              </div>
            </div>
            <div className="container mx-auto px-4 py-8">
              <PythList />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
