"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICE_SERVICE_CONN = exports.MATIC_PRICE_FEED_ID = exports.DAI_PRICE_FEED_ID = exports.DOGE_PRICE_FEED_ID = exports.UNI_PRICE_FEED_ID = exports.BTC_PRICE_FEED_ID = exports.ETH_PRICE_FEED_ID = exports.PYTH_CONTRACT_ADDR = exports.INJECTIVE_WALLET = void 0;
const price_service_client_1 = require("@pythnetwork/price-service-client");
const injective_1 = require("../injective/injective");
const networks_1 = require("@injectivelabs/networks");
const getMnemonic = () => {
    return 'begin holiday crystal say glide saddle typical access gold undo delay jelly';
};
exports.INJECTIVE_WALLET = new injective_1.Injective((0, networks_1.getNetworkInfo)(networks_1.Network.TestnetK8s).grpc, getMnemonic());
exports.PYTH_CONTRACT_ADDR = 'inj1z60tg0tekdzcasenhuuwq3htjcd5slmgf7gpez';
exports.ETH_PRICE_FEED_ID = 'ca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6'; // ETH/USD
exports.BTC_PRICE_FEED_ID = 'f9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b'; // BTC/USD
exports.UNI_PRICE_FEED_ID = '64ae1fc7ceacf2cd59bee541382ff3770d847e63c40eb6cf2413e7de5e93078a'; // UNI/USD
exports.DOGE_PRICE_FEED_ID = '31775e1d6897129e8a84eeba975778fb50015b88039e9bc140bbd839694ac0ae'; // DOGE/USD
exports.DAI_PRICE_FEED_ID = '87a67534df591d2dd5ec577ab3c75668a8e3d35e92e27bf29d9e2e52df8de412'; // DAI/USD
exports.MATIC_PRICE_FEED_ID = 'd2c2c1f2bba8e0964f9589e060c2ee97f5e19057267ac3284caef3bd50bd2cb5'; // MATIC/USD
exports.PRICE_SERVICE_CONN = new price_service_client_1.PriceServiceConnection('https://xc-testnet.pyth.network');
