use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap};
use near_sdk::json_types::ValidAccountId;
use near_sdk::{env, near_bindgen, BorshStorageKey};

near_sdk::setup_alloc!();

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    Records,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct StatusMessage {
    pub records: LookupMap<String, String>,
}

impl Default for StatusMessage {
    fn default() -> Self {
        Self {
            records: LookupMap::new(StorageKey::Records),
        }
    }
}

#[near_bindgen]
impl StatusMessage {
    pub fn set_status(&mut self, message: String) {
        let key = env::signer_account_id();
    }

    pub fn get_status(&self, account_id: ValidAccountId) -> Option<String> {
        
    }
}
