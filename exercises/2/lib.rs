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
        self.val
    }

    pub fn increment(&mut self) {
        self.val += 1;
    }

    pub fn decrement(&mut self) {
        self.val -= 1;
    }

    pub fn reset(&mut self) {
        self.val = 0;
    }
}
