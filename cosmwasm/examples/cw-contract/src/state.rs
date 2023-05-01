use cosmwasm_std::Addr;
use schemars::JsonSchema;
use serde::{
    Deserialize,
    Serialize,
};

use cw_storage_plus::Item;
use unispot_sdk_cw::PriceIdentifier;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    // Available price feeds and their ids are listed in unispot-sdk-cw Readme.
    pub price_feed_id:      PriceIdentifier,
    // Contract address of UniSpot in different networks are listed in unispot-sdk-cw Readme.
    pub unispot_contract_addr: Addr,
}

pub const STATE: Item<State> = Item::new("state");
