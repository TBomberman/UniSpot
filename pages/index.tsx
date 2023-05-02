import Image from 'next/image'
import { IBM_Plex_Mono } from 'next/font/google'
import Logo from '@/assets/logo.png'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { BsArrowRight } from 'react-icons/bs'
import { RxDashboard } from 'react-icons/rx'
import { IoWalletOutline, IoNotificationsOutline } from 'react-icons/io5'
import { TbArrowsExchange } from 'react-icons/tb'
import { RiExchangeFundsLine } from 'react-icons/ri'
import PriceChart from '@/components/PriceChart'
import price from '@/config/Prices.json'

const inter = IBM_Plex_Mono({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

export default function Home() {
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
          <div className={'flex justify-between items-center bg-[#6271EB] text-white py-3 px-6 rounded-xl cursor-pointer'}>
            <div className={'flex items-center gap-2'}>
              <RxDashboard />
              Dashboard
            </div>
            <BsArrowRight />
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
        <div className={'flex w-full justify-between items-center mb-8'}>
          <div className={'text-4xl font-bold'}>
            <p>$46,541.04</p>
          </div>
          <div className={'text-xl font-bold'}>
            <h3>Ethereum (ETH)</h3>
          </div>
        </div>
        <div className={'flex gap-4 mt-4 justify-end'}>
          <div className={'bg-[#1E232A] text-[#6271EB] py-3 px-4 rounded-xl cursor-pointer'}>
            <p>1H</p>
          </div>
          <div className={'bg-transparent border border-gray-600 py-3 px-4 rounded-xl cursor-pointer'}>
            <p>24H</p>
          </div>
          <div className={'bg-transparent border border-gray-600 py-3 px-4 rounded-xl cursor-pointer'}>
            <p>1W</p>
          </div>
          <div className={'bg-transparent border border-gray-600 py-3 px-4 rounded-xl cursor-pointer'}>
            <p>1M</p>
          </div>
          <div className={'bg-transparent border border-gray-600 py-3 px-4 rounded-xl cursor-pointer'}>
            <p>6M</p>
          </div>
          <div className={'bg-transparent border border-gray-600 py-3 px-4 rounded-xl cursor-pointer'}>
            <p>1Y</p>
          </div>
        </div>
        <div className={'flex'}>
          <PriceChart data={price} />
        </div>
      </div>
    </main>
  )
}
