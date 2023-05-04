import { ChainGrpcWasmApi, MsgExecuteContractCompat, toBase64 } from '@injectivelabs/sdk-ts'
import {
  INJECTIVE_WALLET,
  ETH_PRICE_FEED_ID,
  BTC_PRICE_FEED_ID,
  UNI_PRICE_FEED_ID,
  DOGE_PRICE_FEED_ID,
  DAI_PRICE_FEED_ID,
  MATIC_PRICE_FEED_ID,
  PRICE_SERVICE_CONN,
  PYTH_CONTRACT_ADDR,
} from '../constants/index'
import { Coin } from '@injectivelabs/ts-types'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

export async function main() {
  await getPythPrice()
}

const getPythPrice = async () => {
  const NETWORK = Network.TestnetK8s
  const ENDPOINTS = getNetworkEndpoints(NETWORK)
  const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc)

  const vaasETH = await PRICE_SERVICE_CONN.getLatestVaas([ETH_PRICE_FEED_ID])
  const vaasBTC = await PRICE_SERVICE_CONN.getLatestVaas([BTC_PRICE_FEED_ID])
  const vaasUNI = await PRICE_SERVICE_CONN.getLatestVaas([UNI_PRICE_FEED_ID])
  const vaasDOGE = await PRICE_SERVICE_CONN.getLatestVaas([DOGE_PRICE_FEED_ID])
  const vaasDAI = await PRICE_SERVICE_CONN.getLatestVaas([DAI_PRICE_FEED_ID])
  const vaasMATIC = await PRICE_SERVICE_CONN.getLatestVaas([MATIC_PRICE_FEED_ID])
  updatePythFee(chainGrpcWasmApi, vaasETH).then((res) => {
    console.log(res)
    updatePythFee(chainGrpcWasmApi, vaasBTC).then((res) => {
      console.log(res)
      updatePythFee(chainGrpcWasmApi, vaasUNI).then((res) => {
        console.log(res)
        updatePythFee(chainGrpcWasmApi, vaasDOGE).then((res) => {
          console.log(res)
          updatePythFee(chainGrpcWasmApi, vaasDAI).then(() => {
            updatePythFee(chainGrpcWasmApi, vaasMATIC).then((res) => {
              console.log(res)
            })
          })
        })
      })
    })
  })
}

// get the update fee for this vaa
const updatePythFee = async (chainGrpcWasmApi: ChainGrpcWasmApi, vaas: string[]): Promise<string> => {
  const updateFee = await INJECTIVE_WALLET.querySmartContract<Coin>(PYTH_CONTRACT_ADDR, {
    get_update_fee: {
      vaas,
    },
  })
  const pythExecuteMsg = MsgExecuteContractCompat.fromJSON({
    sender: INJECTIVE_WALLET.getAddress(),
    contractAddress: PYTH_CONTRACT_ADDR,
    msg: {
      update_price_feeds: {
        data: vaas,
      },
    },
    funds: [updateFee],
  })
  await INJECTIVE_WALLET.signAndBroadcastPythMsg([pythExecuteMsg])

  console.log('Success')
  const response1 = await chainGrpcWasmApi.fetchSmartContractState(PYTH_CONTRACT_ADDR, toBase64({ price_feed: { id: ETH_PRICE_FEED_ID } }))
  const stateString1: string = new TextDecoder().decode(response1.data)
  return stateString1
}
