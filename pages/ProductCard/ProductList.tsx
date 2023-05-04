import React, { useCallback, useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import USDC from '../../assets/usdc.jpg'
import eth from '../../assets/eth.jpg'
import doge from '../../assets/doge.jpg'
import FILST from '../../assets/FILST.jpg'
import FNK from '../../assets/FNK.jpg'
import XFIT from '../../assets/XFIT.jpg'
import { ChainGrpcWasmApi, toBase64 } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const ProductList = () => {
  const [fetching, setFetching] = useState<boolean>(false)
  const [prices, setPrices] = useState([
    {
      id: 1,
      name: 'USDC/USDT',
      price: '',
      image: USDC,
    },
    {
      id: 2,
      name: 'WETH/USDT',
      price: '',
      image: eth,
    },
    {
      id: 3,
      name: 'DOGE/USDT',
      price: '',
      image: doge,
    },
    {
      id: 4,
      name: 'FILST/USDT',
      price: '',
      image: FILST,
    },
    {
      id: 5,
      name: 'FNK/USDT',
      price: '',
      image: FNK,
    },
    {
      id: 6,
      name: 'XFIT/USDT',
      price: '',
      image: XFIT,
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
        if (prices[i].name === 'WETH/USDT' || prices[i].name === 'FILST/USDT' || prices[i].name === 'FNK/USDT' || prices[i].name === 'XFIT/USDT') {
          oldPrice[i].price = `$${(parseFloat(state.price.price) * 1000000000000).toFixed(2)}`
        } else if (prices[i].name === 'DOGE/USDT') {
          oldPrice[i].price = `$${(parseFloat(state.price.price) * 100).toFixed(2)}`
        } else {
          oldPrice[i].price = `$${parseFloat(state.price.price).toFixed(2)}`
        }
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
