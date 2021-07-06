#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "robert.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "jane.testnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn test_get_num() {
        let context = get_context(vec![], false);
        testing_env!(context);

        let contract = Counter { val: 15 };

        assert_eq!(15, contract.get_num());
    }

    #[test]
    fn test_increment() {
        let context = get_context(vec![], false);
        testing_env!(context);

        let mut contract = Counter { val: 0 };
        contract.increment();

        assert_eq!(1, contract.get_num());
    }

    #[test]
    fn test_decrement() {
        let context = get_context(vec![], false);
        testing_env!(context);

        let mut contract = Counter { val: 0 };
        contract.decrement();

        assert_eq!(-1, contract.get_num());
    }

    #[test]
    fn test_increment_and_reset() {
        let context = get_context(vec![], false);
        testing_env!(context);

        let mut contract = Counter { val: 42 };
        contract.reset();

        assert_eq!(0, contract.get_num());
    }
}
