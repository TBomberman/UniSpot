use  {
    schemars::JsonSchema,
    serde::{Deserialize, Serialize},
    cosmwasm_std::{
        Addr,
        Storage,
    },
    cosmwasm_storage::{
        bucket,
        bucket_read,
        Bucket,
        ReadonlyBucket,
    }
};

pub static SINGLETONS_KEY: &[u8] = b"singletons";
pub static PRICE_KEY: &[u8] = b"price";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Singletons {
    pub count: i32,
    pub owner: Addr,
    pub prices: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Price {
    pub name: String,
    pub price: String,
}

pub fn price_bucket(storage: &mut dyn Storage) -> Bucket<Price> {
    bucket(storage, PRICE_KEY)
}

pub fn price_read_bucket(storage: &dyn Storage) -> ReadonlyBucket<Price> {
    bucket_read(storage, PRICE_KEY)
}
