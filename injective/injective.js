"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injective = void 0;
const sdk_ts_1 = require("@injectivelabs/sdk-ts");
class Injective {
    constructor(grpcEndpoint, mnemonic) {
        this.grpcEndpoint = grpcEndpoint;
        this.mnemonic = mnemonic;
        this.chainId = 'injective-888';
        this.wallet = sdk_ts_1.PrivateKey.fromMnemonic(mnemonic);
    }
    getAddress() {
        return this.wallet.toBech32();
    }
    async signAndBroadcastMsg(msg) {
        const chainGrpcAuthApi = new sdk_ts_1.ChainGrpcAuthApi(this.grpcEndpoint);
        const account = await chainGrpcAuthApi.fetchAccount(this.getAddress());
        const txService = new sdk_ts_1.TxGrpcClient(this.grpcEndpoint);
        const { signBytes, txRaw } = (0, sdk_ts_1.createTransactionFromMsg)({
            sequence: account.baseAccount.sequence,
            accountNumber: account.baseAccount.accountNumber,
            message: msg,
            chainId: this.chainId,
            pubKey: this.wallet.toPublicKey().toBase64(),
        });
        const sig = await this.wallet.sign(Buffer.from(signBytes));
        /** Append Signatures */
        txRaw.signatures.push(sig);
        const txResponse = await txService.broadcast(txRaw);
        if (txResponse.code !== 0) {
            console.log(`Transaction failed: ${txResponse.rawLog}`);
            throw new Error(`Transaction failed: ${txResponse.rawLog}`);
        }
        else {
            console.log(`Sent tx: ${JSON.stringify(txResponse.txHash)}`);
        }
        return txResponse;
    }
    async querySmartContract(contract, query) {
        const api = new sdk_ts_1.ChainGrpcWasmApi(this.grpcEndpoint);
        const queryStr = Buffer.from(JSON.stringify(query)).toString('base64');
        const { data } = await api.fetchSmartContractState(contract, queryStr);
        const numArr = Array.from(data);
        const json = String.fromCharCode.apply(null, numArr);
        return JSON.parse(json);
    }
}
exports.Injective = Injective;
