import React, { useCallback, useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import wbtc from '../../assets/wbtc.png'
import eth from '../../assets/eth.jpg'
import doge from '../../assets/doge.jpg'
import uni from '../../assets/uni.png'
import dai from '../../assets/dai.png'
import matic from '../../assets/matic.jpg'
import { ChainGrpcWasmApi, toBase64 } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const ProductList = () => {
  const [fetching, setFetching] = useState<boolean>(false)
  const [prices, setPrices] = useState([
    {
      id: 1,
      name: 'WETH-USDT',
      price: '',
      image: eth,
    },
    {
      id: 2,
      name: 'WBTC-WETH',
      price: '',
      image: wbtc,
    },
    {
      id: 3,
      name: 'UNI-WETH',
      price: '',
      image: uni,
    },
    {
      id: 4,
      name: 'DOGE-USDT',
      price: '',
      image: doge,
    },
    {
      id: 5,
      name: 'DAI-USDC',
      price: '',
      image: dai,
    },
    {
      id: 6,
      name: 'MATIC-WETH',
      price: '',
      image: matic,
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
        oldPrice[i].price = `$${parseFloat(state.price.price)}`
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
      {!fetching && prices.map((price) => <ProductCard key={price.id} name={price.name} price={price.price} image={price.image} />)}
    </div>
  )
}

export default ProductList
