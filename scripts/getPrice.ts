import { BigNumberish, ethers } from 'ethers'
import { FixedNumber, BigNumber } from '@ethersproject/bignumber'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { abi as IERC20ABI } from '@uniswap/v2-core/build/IERC20.json'

export async function main() {
  await getPriceData('0x3041cbd36888becc7bbcbc0045e3b1f144466f5f', true)
  await getPriceData('0xfcd13ea0b906f2f87229650b8d93a51b2e839ebd', true)
  await getPriceData('0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852', true)
}

const formatPx = (value: BigNumber, decimals?: BigNumberish) => {
  return FixedNumber.fromValue(value, decimals).toString()
}

const calcPrice = (reserve0: BigNumber, reserve1: BigNumber, factor1: BigNumber) => {
  return BigNumber.from(reserve1).gt(0) ? BigNumber.from(reserve0).mul(factor1).div(BigNumber.from(reserve1)) : BigNumber.from(0)
}

const getPrice = (ratios: BigNumber[], decimals: number) => {
  const factor = BigNumber.from(10).pow(decimals)
  const priceInX = calcPrice(ratios[0], ratios[1], factor)
  return formatPx(priceInX, decimals)
}

const getPriceData = async (pairAddrMain: string, tokensReversed: boolean) => {
  const provider = new ethers.InfuraProvider('homestead', 'af5e7f550821452ba99cb73d238692c0')
  const uniPairMain = new ethers.Contract(pairAddrMain, IUniswapV2PairABI, provider)
  let ratioMain = await uniPairMain.getReserves()
  const tokenA = await uniPairMain.token0()
  const token0 = new ethers.Contract(tokenA, IERC20ABI, provider)
  const symbol = await token0.symbol()
  if (tokensReversed) {
    ratioMain = [ratioMain[1], ratioMain[0]]
  }
  const price = getPrice(ratioMain, 18)
  console.log(`Price for ${symbol} = ${price}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
