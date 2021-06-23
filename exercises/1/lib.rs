use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::near_bindgen;

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Counter {
    val: i8,
}

#[near_bindgen]
impl Counter {
    pub fn get_num(&self) -> i8 {

    }

    pub fn increment(&mut self) {

    }

    pub fn decrement(&mut self) {

    }

    pub fn reset(&mut self) {
        
    }
}
