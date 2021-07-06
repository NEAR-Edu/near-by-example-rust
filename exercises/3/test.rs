#[cfg(not(target_arch = "wasm32"))]
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};
    use std::convert::TryInto;

    fn get_context(is_view: bool) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id("bob_near".try_into().unwrap())
            .is_view(is_view)
            .build()
    }

    #[test]
    fn test_set_status() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = StatusMessage::default();
        contract.set_status("hello".to_string());
        assert_eq!(
            "hello".to_string(),
            contract.records.get(&"bob_near".to_string()).unwrap()
        );
    }

    #[test]
    fn test_get_status() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = StatusMessage::default();
        contract
            .records
            .insert(&"francis.near".to_string(), &"hello".to_string());
        assert_eq!(
            Some("hello".to_string()),
            contract.get_status("francis.near".try_into().unwrap())
        );
    }

    #[test]
    fn test_get_status_nonexistent() {
        let context = get_context(true);
        testing_env!(context);
        let contract = StatusMessage::default();
        assert_eq!(
            None,
            contract.get_status("francis.near".try_into().unwrap())
        );
    }
}
