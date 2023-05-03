"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const ethers_1 = require("ethers");
const bignumber_1 = require("@ethersproject/bignumber");
const IUniswapV2Pair_json_1 = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const IERC20_json_1 = require("@uniswap/v2-core/build/IERC20.json");
const sdk_ts_1 = require("@injectivelabs/sdk-ts");
const index_1 = require("../constants/index");
// import { msgBroadcastClient } from '../injective/services'
const UNISPOT_CONTRACT_ADDRESS = 'inj15nmsql52q36utj5cy3gm44nhxmdlx7mhg2hh0c';
async function main() {
    await getPriceData('0x3041cbd36888becc7bbcbc0045e3b1f144466f5f', true);
    await getPriceData('0xfcd13ea0b906f2f87229650b8d93a51b2e839ebd', true);
    await getPriceData('0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852', true);
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
    const symbol = await token0.symbol();
    if (tokensReversed) {
        ratioMain = [ratioMain[1], ratioMain[0]];
    }
    const price = getPrice(ratioMain, 18);
    console.log(`Price for ${symbol} = ${price}`);
    try {
        const updateFee = await index_1.INJECTIVE_WALLET.querySmartContract(UNISPOT_CONTRACT_ADDRESS, {
            get_update_fee: {
                vaas: [btoa(price)],
            },
        });
        updateFee.amount = '0u';
        const msg = sdk_ts_1.MsgExecuteContractCompat.fromJSON({
            contractAddress: UNISPOT_CONTRACT_ADDRESS,
            sender: index_1.INJECTIVE_WALLET.getAddress(),
            msg: {
                update_price_feeds: {
                    data: [btoa(price)],
                },
            },
            funds: [updateFee],
        });
        const res = await index_1.INJECTIVE_WALLET.signAndBroadcastMsg([msg]);
        // await msgBroadcastClient.broadcast({
        //   msgs: msg,
        //   injectiveAddress: INJECTIVE_WALLET.getAddress(),
        // })
    }
    catch (e) {
        console.log(e);
    }
    finally {
        console.log('Done');
    }
    // const updateFee = await INJECTIVE_WALLET.querySmartContract<Coin>(UNISPOT_CONTRACT_ADDRESS, {
    //   get_update_fee: {
    //     vaas: [btoa(price)],
    //   },
    // })
    // // pyth update request
    // updateFee.amount = '100000'
    // const executeMsg = MsgExecuteContract.fromJSON({
    //   sender: INJECTIVE_WALLET.getAddress(),
    //   contractAddress: UNISPOT_CONTRACT_ADDRESS,
    //   msg: {
    //     update_price_feeds: {
    //       data: [btoa(price)],
    //     },
    //   },
    //   funds: [updateFee],
    // })
    // const res = await INJECTIVE_WALLET.signAndBroadcastMsg([executeMsg])
    // console.log(`TxHash: ${res.txHash}`)
};
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
