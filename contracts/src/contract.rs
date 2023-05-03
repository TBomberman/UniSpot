#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, GetPriceResponse, InstantiateMsg, QueryMsg};
use crate::state::{Price, price_bucket, price_read_bucket};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:inj-unispot";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::UpdatePrice { pair_name, price } => execute::update_price(deps, pair_name, price),
    }
}

pub mod execute {
    use super::*;

    pub fn update_price(deps: DepsMut, pair_name: String, price: String) -> Result<Response, ContractError> {
        let new_price = Price {
            name: pair_name.clone(),
            price: price,
        };
        price_bucket(deps.storage).update(
            pair_name.as_bytes(),
            |_maybe_price| -> StdResult<Price> {
                Ok(new_price)
            }
        );

        Ok(Response::new().add_attribute("action", "update_price"))
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetPrice { pair_name } => to_binary(&query::get_price(deps, pair_name)?),
    }
}

pub mod query {
    use super::*;

    pub fn get_price(deps: Deps, pair_name: String) -> StdResult<GetPriceResponse> {
        let null_price = Price {
            name: "null".to_string(),
            price: "0".to_string(),
        };
        match price_read_bucket(deps.storage).load(pair_name.as_bytes(),) {
            Ok(price) => Ok(GetPriceResponse { price }),
            Err(_) => Ok(GetPriceResponse { 
                price: null_price
            }),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary};

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies();

        let msg = InstantiateMsg { count: 17 };
        let info = mock_info("Unispot Creator", &coins(1000, "US"));

        // we can just call .unwrap() to assert this was a success
        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());
    }

    #[test]
    fn update_price() {
        let mut deps = mock_dependencies();

        let msg = InstantiateMsg { count: 17 };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        // beneficiary can release it
        let info = mock_info("anyone", &coins(2, "token"));
        let mut msg = ExecuteMsg::UpdatePrice { 
            pair_name: "ETHUSDT".to_string(), 
            price: "2000".to_string() 
        };
        let mut _res = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();

        // add another
        msg = ExecuteMsg::UpdatePrice { 
            pair_name: "INJUSDT".to_string(), 
            price: "20".to_string() 
        };
         _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        // should return 2000
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetPrice {
            pair_name: "ETHUSDT".to_string()
        }).unwrap();
        let value: GetPriceResponse = from_binary(&res).unwrap();
        assert_eq!("2000", value.price.price);

        // should return 20
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetPrice {
            pair_name: "INJUSDT".to_string()
        }).unwrap();
        let value: GetPriceResponse = from_binary(&res).unwrap();
        assert_eq!("20", value.price.price);
    }
}
