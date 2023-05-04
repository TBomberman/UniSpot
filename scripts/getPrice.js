"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const ethers_1 = require("ethers");
const bignumber_1 = require("@ethersproject/bignumber");
const IUniswapV2Pair_json_1 = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const IERC20_json_1 = require("@uniswap/v2-core/build/IERC20.json");
const UNISPOT_CONTRACT_ADDRESS = 'inj12zgysmc6zgd0d0hv00fhueeyc6axwgww5rz2t8';
async function main() {
    await getPriceData('0x3041cbd36888becc7bbcbc0045e3b1f144466f5f', true); // USDC
    await getPriceData('0xfcd13ea0b906f2f87229650b8d93a51b2e839ebd', true); // DOGE
    await getPriceData('0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852', true); // ETH
    await getPriceData('0x61b62c5d56ccd158a38367ef2f539668a06356ab', true); // FNK
    await getPriceData('0xf8d99cf7046dedcb1dc8cfc309aa96946c9b9db2', true); // XFIT
    await getPriceData('0xa2f6a219a51b4682e34a13a94c160d6c79cdca35', true); // FILST
}
exports.main = main;
const formatPx = (value, decimals) => {
    return bignumber_1.FixedNumber.fromValue(value, decimals).toString();
};
const calcPrice = (reserve0, reserve1, factor1) => {
    return bignumber_1.BigNumber.from(reserve1).gt(0) ? bignumber_1.BigNumber.from(reserve0).mul(factor1).div(bignumber_1.BigNumber.from(reserve1)) : bignumber_1.BigNumber.from(0);
};
const getPrice = (ratios, decimals) => {
    const factor = bignumber_1.BigNumber.from(10).pow(decimals);
    const priceInX = calcPrice(ratios[0], ratios[1], factor);
    return formatPx(priceInX, decimals);
};
const getPriceData = async (pairAddrMain, tokensReversed) => {
    const provider = new ethers_1.ethers.InfuraProvider('homestead', 'af5e7f550821452ba99cb73d238692c0');
    const uniPairMain = new ethers_1.ethers.Contract(pairAddrMain, IUniswapV2Pair_json_1.abi, provider);
    let ratioMain = await uniPairMain.getReserves();
    const tokenA = await uniPairMain.token0();
    const token0 = new ethers_1.ethers.Contract(tokenA, IERC20_json_1.abi, provider);
    const tokenB = await uniPairMain.token1();
    const token1 = new ethers_1.ethers.Contract(tokenB, IERC20_json_1.abi, provider);
    const symbolA = await token0.symbol();
    console.log((await token0.decimals()).toString());
    const symbolB = await token1.symbol();
    if (tokensReversed) {
        ratioMain = [ratioMain[1], ratioMain[0]];
    }
    const price = getPrice(ratioMain, 18);
    console.log(`Price for ${symbolA} / ${symbolB} = ${price}`);
    // try {
    //   const msg = MsgExecuteContractCompat.fromJSON({
    //     contractAddress: UNISPOT_CONTRACT_ADDRESS,
    //     sender: INJECTIVE_WALLET.getAddress(),
    //     msg: {
    //       update_price: {
    //         pair_name: `${symbolA}/${symbolB}`,
    //         price: price,
    //       },
    //     },
    //   })
    //   const res = await INJECTIVE_WALLET.signAndBroadcastMsg([msg])
    //   console.log('Success')
    // } catch (e) {
    //   console.log(e)
    // } finally {
    //   console.log('Done')
    // }
};
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
