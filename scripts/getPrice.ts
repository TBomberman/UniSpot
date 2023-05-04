import { BigNumberish, ethers } from 'ethers'
import { FixedNumber, BigNumber } from '@ethersproject/bignumber'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { abi as IERC20ABI } from '@uniswap/v2-core/build/IERC20.json'
import { MsgExecuteContractCompat } from '@injectivelabs/sdk-ts'
import { INJECTIVE_WALLET } from '../constants/index'

const UNISPOT_CONTRACT_ADDRESS = 'inj12zgysmc6zgd0d0hv00fhueeyc6axwgww5rz2t8'

export async function main() {
  await getPriceData("0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", [18,6], true); // ETH-USDT
  await getPriceData("0xbb2b8038a1640196fbe3e38816f3e67cba72d940", [8,18], true); // WBTC-ETH
  await getPriceData("0xd3d2e2692501a5c9ca623199d38826e513033a17", [18,18], true); // UNI-ETH
  await getPriceData("0xfcd13ea0b906f2f87229650b8d93a51b2e839ebd", [8,6], true); // DOGE-USDT
  await getPriceData("0xae461ca67b15dc8dc81ce7615e0320da1a9ab8d5", [18,6], true); // DAI-USDC
  await getPriceData("0x819f3450da6f110ba6ea52195b3beafa246062de", [18,18], true); // MATIC-ETH
}

const getPrice = (ratios: BigNumber[], decimals: number[]) => {
  const baseFactor = BigNumber.from(10).pow(18)
  const factor0 = BigNumber.from(10).pow(decimals[0])
  const factor1 = BigNumber.from(10).pow(decimals[1])
  const nicePrecision = BigNumber.from(ratios[0]).mul(baseFactor).div(BigNumber.from(ratios[1])).mul(factor1).div(factor0)
  return FixedNumber.fromValue(nicePrecision, 18).toString()
}

const getPriceData = async (
  pairAddrMain: string,
  decimalsLocal: number[],
  tokensReversed: boolean
) => {
  console.log("pairAddrMain", pairAddrMain);
  const provider = new ethers.InfuraProvider('homestead', 'af5e7f550821452ba99cb73d238692c0')
  const uniPairMain = new ethers.Contract(pairAddrMain, IUniswapV2PairABI, provider)
  let ratioMain = await uniPairMain.getReserves()
  const tokenA = await uniPairMain.token0()
  const token0 = new ethers.Contract(tokenA, IERC20ABI, provider)
  const tokenB = await uniPairMain.token1()
  const token1 = new ethers.Contract(tokenB, IERC20ABI, provider)
  const symbol0 = await token0.symbol()
  const symbol1 = await token1.symbol()

  const pairName = tokensReversed ? symbol0 + '-' + symbol1 : symbol1 + '-' + symbol0
  if (tokensReversed) {
    ratioMain = [ratioMain[1], ratioMain[0]]
    decimalsLocal = [decimalsLocal[1], decimalsLocal[0]];
  }
  const price = getPrice(ratioMain, decimalsLocal);
  console.log(`Price for ${pairName} = ${price}`)

  try {
    const msg = MsgExecuteContractCompat.fromJSON({
      contractAddress: UNISPOT_CONTRACT_ADDRESS,
      sender: INJECTIVE_WALLET.getAddress(),
      msg: {
        update_price: {
          pair_name: pairName,
          price: price,
        },
      },
    })

    const res = await INJECTIVE_WALLET.signAndBroadcastMsg([msg])
    console.log('Success')
    // console.log(res)
  } catch (e) {
    console.log(e)
  } finally {
    console.log('Done')
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
