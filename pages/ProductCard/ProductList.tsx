import React, { useCallback, useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import wbtc from '../../assets/wbtc.svg'
import eth from '../../assets/eth.svg'
import doge from '../../assets/doge.png'
import uni from '../../assets/uni.svg'
import dai from '../../assets/dai.svg'
import matic from '../../assets/matic.svg'
import usdt from '../../assets/usdt.svg'
import usdc from '../../assets/usdc.svg'
import { ChainGrpcWasmApi, toBase64 } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const ProductList = () => {
  const [fetching, setFetching] = useState<boolean>(false)
  const [prices, setPrices] = useState([
    {
      id: 1,
      name: 'WETH-USDT',
      price: '',
      image1: usdt,
      image2: eth,
    },
    {
      id: 2,
      name: 'WBTC-WETH',
      price: '',
      image1: eth,
      image2: wbtc,
    },
    {
      id: 3,
      name: 'UNI-WETH',
      price: '',
      image1: eth,
      image2: uni,
    },
    {
      id: 4,
      name: 'DOGE-USDT',
      price: '',
      image1: usdt,
      image2: doge,
    },
    {
      id: 5,
      name: 'DAI-USDC',
      price: '',
      image1: usdc,
      image2: dai,
    },
    {
      id: 6,
      name: 'MATIC-WETH',
      price: '',
      image1: eth,
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
        const response = await chainGrpcWasmApi.fetchSmartContractState('inj12zgysmc6zgd0d0hv00fhueeyc6axwgww5rz2t8', toBase64({ get_price: { pair_name: prices[i].name } }))
        const stateString: string = new TextDecoder().decode(response.data)
        const state = JSON.parse(stateString)
        oldPrice[i].price = `$${parseFloat(state.price.price).toFixed(2)}`
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

  return (
    <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      {!fetching && prices.map((price) => <ProductCard key={price.id} name={price.name} price={price.price} image1={price.image1} image2={price.image2} />)}
    </div>
  )
}

export default ProductList
