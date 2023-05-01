use {
    cosmwasm_schema::write_api,
    unispot_cosmwasm::msg::{
        InstantiateMsg,
        MigrateMsg,
    },
    unispot_sdk_cw::{
        ExecuteMsg,
        QueryMsg,
    },
};

fn main() {
    write_api! {
        instantiate: InstantiateMsg,
        execute: ExecuteMsg,
        migrate: MigrateMsg,
        query: QueryMsg
    }
}
