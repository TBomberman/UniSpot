use cosmwasm_schema::{cw_serde, QueryResponses};
use crate::state::{Price};

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    UpdatePrice { pair_name: String, price: String },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(GetPriceResponse)]
    GetPrice { pair_name: String },
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetPriceResponse {
    pub price: Price,
}
