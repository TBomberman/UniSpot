import React, { useCallback, useEffect, useState } from 'react'
import wbtc from '../../assets/wbtc.svg'
import eth from '../../assets/eth.svg'
import doge from '../../assets/doge.png'
import uni from '../../assets/uni.svg'
import dai from '../../assets/dai.svg'
import matic from '../../assets/matic.svg'
import usdt from '../../assets/usdt.svg'
import { ChainGrpcWasmApi, toBase64 } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { main } from '@/scripts/pyth'
import PythCard from './PythCard'
import { PYTH_CONTRACT_ADDR } from '@/constants'

const PythList = () => {
  const [fetching, setFetching] = useState<boolean>(false)
  const [prices, setPrices] = useState([
    {
      id: 'ca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6',
      name: 'ETH-USD',
      price: '',
      image1: usdt,
      image2: eth,
    },
    {
      id: 'f9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b',
      name: 'BTC-USD',
      price: '',
      image1: usdt,
      image2: wbtc,
    },
    {
      id: '64ae1fc7ceacf2cd59bee541382ff3770d847e63c40eb6cf2413e7de5e93078a',
      name: 'UNI-USD',
      price: '',
      image1: usdt,
      image2: uni,
    },
    {
      id: '31775e1d6897129e8a84eeba975778fb50015b88039e9bc140bbd839694ac0ae',
      name: 'DOGE-USD',
      price: '',
      image1: usdt,
      image2: doge,
    },
    {
      id: '87a67534df591d2dd5ec577ab3c75668a8e3d35e92e27bf29d9e2e52df8de412',
      name: 'DAI-USD',
      price: '',
      image1: usdt,
      image2: dai,
    },
    {
      id: 'd2c2c1f2bba8e0964f9589e060c2ee97f5e19057267ac3284caef3bd50bd2cb5',
      name: 'MATIC-USD',
      price: '',
      image1: usdt,
      image2: matic,
    },
  ])

  const fetchCount = useCallback(async () => {
    try {
      setFetching(true)
      const NETWORK = Network.TestnetK8s
      const ENDPOINTS = getNetworkEndpoints(NETWORK)
      const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc)
      let oldPrice = prices
      for (let i = 0; i < prices.length; i++) {
        const response = await chainGrpcWasmApi.fetchSmartContractState(PYTH_CONTRACT_ADDR, toBase64({ price_feed: { id: prices[i].id } }))
        const stateString: string = new TextDecoder().decode(response.data)
        const state = JSON.parse(stateString)
        oldPrice[i].price = `$${parseFloat(state.price_feed.price.price).toFixed(4)}`
      }
      setPrices(oldPrice)
      setFetching(false)
    } catch (e) {
      setFetching(false)
      alert((e as any).message)
    }
  }, [prices])

  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  const fetchPythPrices = async () => {
    main().then(() => {
      fetchCount()
    })
  }

  return (
    <>
      <div>
        <button
          className="bg-[#6271EB] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => {
            fetchPythPrices()
          }}
        >
          Fetch Latest Price
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {!fetching && prices.map((price) => <PythCard key={price.id} name={price.name} price={price.price} image1={price.image1} image2={price.image2} />)}
      </div>
    </>
  )
}

export default PythList
