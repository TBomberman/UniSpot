# UniSpot SDK CW

This crate exposes utilities to interact with the contract on the CosmWasm ecosystem.
You can also look at the [example contract](../examples/cw-contract/) which demonstrates how to read price feeds from on-chain CosmWasm applications.

## Installation

Add this crate to the dependencies section of your CosmWasm contract's `Cargo.toml` file:

```
[dependencies]
pyth-sdk-cw = "1.0.0"
```

## Usage

Simply import the structs exposed by the crate and use them while interacting with the unispot contract. For example:

```rust
// to query UniSpot contract
use pyth_sdk_cw::{
    PriceFeedResponse,
    query_price_feed,
};

... {
    let price_feed_response: PriceFeedResponse = query_price_feed(&deps.querier, state.unispot_contract_addr, state.price_feed_id)?;
    let price_feed = price_feed_response.price_feed;
}
....
```

This snippet returns a `PriceFeed` struct which exposes methods for reading the current price along with other useful functionality.
See the [UniSpot common SDK documentation](https://github.com/unispot-network/pyth-sdk-rs/tree/main/pyth-sdk#unispot-network-common-rust-sdk) for more information
about this struct.
The common SDK also provides methods for combining price feeds in several useful ways.
These methods allow you to derive prices for alternative quote currencies -- for example, to derive the BTC/ETH price from
the BTC/USD and ETH/USD price feeds -- and to price baskets of currencies.

## Contracts and Price Feeds

UniSpot is currently available on the following cosmwasm chains:

### Testnet

| Network   | Contract address                             |
| --------- | -------------------------------------------- |
| Injective | `inj1z60tg0tekdzcasenhuuwq3htjcd5slmgf7gpez` |

Available price feeds on these networks can be find below:

### Price Feeds

| Network           | Available Price Feeds                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Injective Testnet | [https://unispot.network/developers/price-feed-ids#injective-testnet](https://unispot.network/developers/price-feed-ids#injective-testnet) |
