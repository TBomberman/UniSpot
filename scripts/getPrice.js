"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const ethers_1 = require("ethers");
const bignumber_1 = require("@ethersproject/bignumber");
const IUniswapV2Pair_json_1 = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const IERC20_json_1 = require("@uniswap/v2-core/build/IERC20.json");
const sdk_ts_1 = require("@injectivelabs/sdk-ts");
const index_1 = require("../constants/index");
const UNISPOT_CONTRACT_ADDRESS = 'inj12zgysmc6zgd0d0hv00fhueeyc6axwgww5rz2t8';
async function main() {
    await getPriceData("0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", [18, 6], true); // ETH-USDT
    await getPriceData("0xbb2b8038a1640196fbe3e38816f3e67cba72d940", [8, 18], true); // WBTC-ETH
    // await getPriceData("0xd3d2e2692501a5c9ca623199d38826e513033a17", [18,18], true); // UNI-ETH
    // await getPriceData("0xfcd13ea0b906f2f87229650b8d93a51b2e839ebd", [18,18], true); // DOGE-USDT
    // await getPriceData("0xae461ca67b15dc8dc81ce7615e0320da1a9ab8d5", [18,18], true); // DAI-USDC
    // await getPriceData("0x819f3450da6f110ba6ea52195b3beafa246062de", [18,18], true); // MATIC-ETH
}
exports.main = main;
const formatPx = (value, decimals) => {
    console.log("formatPx 1", value.toString());
    // const formatDecimals = 18 + decimals[0] - decimals [1]
    const formatDecimals = 18;
    console.log("formatPx 2", formatDecimals);
    return bignumber_1.FixedNumber.fromValue(value, formatDecimals).toString();
};
const calcPriceIn18 = (reserve0, reserve1, decimals) => {
    console.log("calcPriceIn18 1");
    const baseFactor = bignumber_1.BigNumber.from(10).pow(18);
    const factor0 = bignumber_1.BigNumber.from(10).pow(decimals[0]);
    const factor1 = bignumber_1.BigNumber.from(10).pow(decimals[1]);
    // const nicePrecision = BigNumber.from(reserve0).mul(baseFactor).div(BigNumber.from(reserve1))
    return bignumber_1.BigNumber.from(reserve0).mul(baseFactor).div(bignumber_1.BigNumber.from(reserve1)).mul(factor1).div(factor0);
    // console.log("calcPriceIn18 2", nicePrecision.toString())
    // return nicePrecision.mul(factor1).div(factor0)
};
const getPrice = (ratios, decimals) => {
    console.log("getPrice 1");
    const priceInX = calcPriceIn18(ratios[0], ratios[1], decimals);
    return formatPx(priceInX, decimals);
};
const getPriceData = async (pairAddrMain, decimalsLocal, tokensReversed) => {
    console.log("pairAddrMain", pairAddrMain);
    const provider = new ethers_1.ethers.InfuraProvider('homestead', 'af5e7f550821452ba99cb73d238692c0');
    const uniPairMain = new ethers_1.ethers.Contract(pairAddrMain, IUniswapV2Pair_json_1.abi, provider);
    let ratioMain = await uniPairMain.getReserves();
    const tokenA = await uniPairMain.token0();
    const token0 = new ethers_1.ethers.Contract(tokenA, IERC20_json_1.abi, provider);
    const tokenB = await uniPairMain.token1();
    const token1 = new ethers_1.ethers.Contract(tokenB, IERC20_json_1.abi, provider);
    const symbol0 = await token0.symbol();
    const symbol1 = await token1.symbol();
    const pairName = tokensReversed ? symbol0 + '-' + symbol1 : symbol1 + '-' + symbol0;
    if (tokensReversed) {
        ratioMain = [ratioMain[1], ratioMain[0]];
        decimalsLocal = [decimalsLocal[1], decimalsLocal[0]];
    }
    const price = getPrice(ratioMain, decimalsLocal);
    console.log(`Price for ${pairName} = ${price}`);
    try {
        const msg = sdk_ts_1.MsgExecuteContractCompat.fromJSON({
            contractAddress: UNISPOT_CONTRACT_ADDRESS,
            sender: index_1.INJECTIVE_WALLET.getAddress(),
            msg: {
                update_price: {
                    pair_name: pairName,
                    price: price,
                },
            },
        });
        const res = await index_1.INJECTIVE_WALLET.signAndBroadcastMsg([msg]);
        console.log('Success');
        // console.log(res)
    }
    catch (e) {
        console.log(e);
    }
    finally {
        console.log('Done');
    }
};
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
