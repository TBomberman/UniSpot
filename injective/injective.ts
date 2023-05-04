import { ChainGrpcAuthApi, ChainGrpcWasmApi, Msgs, PrivateKey, TxGrpcClient, TxResponse, createTransactionFromMsg } from '@injectivelabs/sdk-ts'

export class Injective {
  private readonly wallet: PrivateKey
  private readonly chainId = 'injective-888'

  constructor(private readonly grpcEndpoint: string, readonly mnemonic: string) {
    this.wallet = PrivateKey.fromMnemonic(mnemonic)
  }

  getAddress(): string {
    return this.wallet.toBech32()
  }

  async signAndBroadcastMsg(msg: Msgs | Msgs[]): Promise<TxResponse> {
    const chainGrpcAuthApi = new ChainGrpcAuthApi(this.grpcEndpoint)
    const account = await chainGrpcAuthApi.fetchAccount(this.getAddress())
    const txService = new TxGrpcClient(this.grpcEndpoint)

    const { signBytes, txRaw } = createTransactionFromMsg({
      sequence: account.baseAccount.sequence,
      accountNumber: account.baseAccount.accountNumber,
      message: msg,
      chainId: this.chainId,
      pubKey: this.wallet.toPublicKey().toBase64(),
    })

    const sig = await this.wallet.sign(Buffer.from(signBytes))

    /** Append Signatures */
    txRaw.signatures.push(sig)

    const txResponse = await txService.broadcast(txRaw)

    if (txResponse.code !== 0) {
      console.log(`Transaction failed: ${txResponse.rawLog}`)
      throw new Error(`Transaction failed: ${txResponse.rawLog}`)
    } else {
      console.log(`Broadcasted transaction hash: ${JSON.stringify(txResponse.txHash)}`)
    }

    return txResponse
  }

  async signAndBroadcastPythMsg(msg: Msgs | Msgs[]): Promise<TxResponse | null> {
    try {
      const chainGrpcAuthApi = new ChainGrpcAuthApi(this.grpcEndpoint)
      const account = await chainGrpcAuthApi.fetchAccount(this.getAddress())
      const txService = new TxGrpcClient(this.grpcEndpoint)
      const { txRaw: simulateTxRaw } = createTransactionFromMsg({
        sequence: account.baseAccount.sequence,
        accountNumber: account.baseAccount.accountNumber,
        message: msg,
        chainId: this.chainId,
        pubKey: this.wallet.toPublicKey().toBase64(),
      })

      const {
        gasInfo: { gasUsed },
      } = await txService.simulate(simulateTxRaw)

      const fee = {
        amount: [
          {
            denom: 'inj',
            amount: (gasUsed * 5000000000 * 2.8).toFixed(),
          },
        ],
        gas: (gasUsed * 2.8).toFixed(),
      }

      const { signBytes, txRaw } = createTransactionFromMsg({
        sequence: account.baseAccount.sequence,
        accountNumber: account.baseAccount.accountNumber,
        message: msg,
        chainId: this.chainId,
        pubKey: this.wallet.toPublicKey().toBase64(),
        fee,
      })
      const sig = await this.wallet.sign(Buffer.from(signBytes))

      /** Append Signatures */
      txRaw.signatures.push(sig)

      const txResponse = await txService.broadcast(txRaw)

      if (txResponse.code !== 0) {
        console.log(`Transaction failed: ${txResponse.rawLog}`)
        throw new Error(`Transaction failed: ${txResponse.rawLog}`)
      } else {
        console.log(`Broadcasted transaction hash: ${JSON.stringify(txResponse.txHash)}`)
      }

      return txResponse
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async querySmartContract<T>(contract: string, query: Object): Promise<T> {
    const api = new ChainGrpcWasmApi(this.grpcEndpoint)
    const queryStr = Buffer.from(JSON.stringify(query)).toString('base64')
    const { data } = await api.fetchSmartContractState(contract, queryStr)

    const numArr = Array.from(data)
    const json = String.fromCharCode.apply(null, numArr)
    return JSON.parse(json) as T
  }
}
