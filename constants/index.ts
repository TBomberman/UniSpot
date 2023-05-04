import { PriceServiceConnection } from '@pythnetwork/price-service-client'
import { Injective } from '../injective/injective'
import { getNetworkInfo, Network } from '@injectivelabs/networks'

const getMnemonic = (): string => {
  return 'begin holiday crystal say glide saddle typical access gold undo delay jelly'
}

export const INJECTIVE_WALLET = new Injective(getNetworkInfo(Network.TestnetK8s).grpc, getMnemonic())
export const PYTH_CONTRACT_ADDR = 'inj1z60tg0tekdzcasenhuuwq3htjcd5slmgf7gpez'
export const ETH_PRICE_FEED_ID = 'ca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6' // ETH/USD
export const BTC_PRICE_FEED_ID = 'f9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b' // BTC/USD
export const UNI_PRICE_FEED_ID = '64ae1fc7ceacf2cd59bee541382ff3770d847e63c40eb6cf2413e7de5e93078a' // UNI/USD
export const DOGE_PRICE_FEED_ID = '31775e1d6897129e8a84eeba975778fb50015b88039e9bc140bbd839694ac0ae' // DOGE/USD
export const DAI_PRICE_FEED_ID = '87a67534df591d2dd5ec577ab3c75668a8e3d35e92e27bf29d9e2e52df8de412' // DAI/USD
export const MATIC_PRICE_FEED_ID = 'd2c2c1f2bba8e0964f9589e060c2ee97f5e19057267ac3284caef3bd50bd2cb5' // MATIC/USD

export const PRICE_SERVICE_CONN = new PriceServiceConnection('https://xc-testnet.pyth.network')
