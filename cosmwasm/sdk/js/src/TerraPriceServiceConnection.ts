import {
  PriceServiceConnection,
  HexString,
} from "@unispotnetwork/price-service-client";
import { MsgExecuteContract } from "@terra-money/terra.js";

export class TerraPriceServiceConnection extends PriceServiceConnection {
  /**
   * Creates Terra messages for updating given price feeds.
   * The messages can be included alongside other messages in a single transaction.
   * They will succeed even if the prices are updated with newer messages;
   *
   * Example usage:
   * ```typescript
   * const unispotContractAddr = CONTRACT_ADDR['testnet'];
   * const unispotMsgs = await connection.getUniSpotPriceUpdateMessage(priceIds, unispotContractAddr, wallet.key.accAddress);
   * const tx = await wallet.createAndSignTx({ msgs: [...unispotMsgs, otherMsg, anotherMsg] });
   * ```
   *
   * This will throw an axios error if there is a network problem or the price service returns non-ok response (e.g: Invalid price ids)
   *
   * @param priceIds Array of hex-encoded price ids without leading 0x.
   * @param unispotContractAddr: UniSpot contract address. you can use CONTRACT_ADDR that contains UniSpot contract addresses in
   * the networks that UniSpot is live on.
   * @param senderAddr: Sender address of the created messages. Sender should sign and pay the transaction that contains them.
   * @returns Array of Terra messages that can be included in a transaction to update the given prices.
   */
  async getPriceUpdateMessages(
    priceIds: HexString[],
    unispotContractAddr: string,
    senderAddr: string
  ): Promise<MsgExecuteContract[]> {
    const latestVaas = await this.getLatestVaas(priceIds);
    return latestVaas.map(
      (vaa) =>
        new MsgExecuteContract(senderAddr, unispotContractAddr, {
          submit_vaa: {
            data: vaa,
          },
        })
    );
  }
}
