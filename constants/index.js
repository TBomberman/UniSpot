"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INJECTIVE_WALLET = void 0;
const injective_1 = require("../injective/injective");
const networks_1 = require("@injectivelabs/networks");
const getMnemonic = () => {
    return 'begin holiday crystal say glide saddle typical access gold undo delay jelly';
};
exports.INJECTIVE_WALLET = new injective_1.Injective((0, networks_1.getNetworkInfo)(networks_1.Network.TestnetK8s).grpc, getMnemonic());
