use std::collections::HashMap;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, Vector};
use near_sdk::json_types::ValidAccountId;
use near_sdk::{env, near_bindgen, AccountId, BorshStorageKey, PanicOnDefault};

near_sdk::setup_alloc!();

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    EXERCISES,
    ACCOUNTS,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    pub owner_id: AccountId,
    pub exercises: Vector<String>,
    pub accounts: LookupMap<String, HashMap<String, bool>>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(initial_exercises: Vec<String>) -> Self {
        let mut exercises = Vector::new(StorageKey::EXERCISES);
        exercises.extend(initial_exercises);
        Self {
            exercises,
            owner_id: env::signer_account_id(),
            accounts: LookupMap::new(StorageKey::ACCOUNTS),
        }
    }

    pub fn add_exercise(&mut self, exercise_index: u64, exercise_title: String) {
        assert_eq!(
            env::signer_account_id(),
            self.owner_id,
            "Only owner can add exercises"
        );
        assert!(
            exercise_index <= self.exercises.len(),
            "Exercise Index out of range"
        );
        let mut next = exercise_title;
        for index in exercise_index..self.exercises.len() {
            next = self.exercises.replace(index, &next);
        }

        self.exercises.push(&next);
    }

    pub fn remove_exercise(&mut self, exercise_index: u64) {
        assert_eq!(
            env::signer_account_id(),
            self.owner_id,
            "Only owner can remove exercises"
        );
        assert!(
            exercise_index < self.exercises.len(),
            "Exercise Index out of range"
        );

        let mut next = self.exercises.pop().unwrap();
        for index in (exercise_index..self.exercises.len()).rev() {
            next = self.exercises.replace(index, &next);
        }
    }

    pub fn get_status(&self, account_id: ValidAccountId) -> Vec<(String, bool)> {
        let status = self
            .accounts
            .get(&account_id.to_string())
            .unwrap_or(HashMap::new());

        self.exercises
            .iter()
            .map(|exercise| {
                (
                    exercise.clone(),
                    status.get(&exercise).unwrap_or(&false).clone(),
                )
            })
            .collect()
    }

    pub fn set_status(&mut self, account_id: ValidAccountId, exercise_index: u64, success: bool) {
        let title = self.exercises.get(exercise_index).unwrap();
        let mut status = self.internal_get_status(account_id.clone().into());
        status.insert(title, success);
        self.accounts.insert(&account_id.to_string(), &status);
    }

    #[private]
    fn internal_get_status(&self, account_id: AccountId) -> HashMap<String, bool> {
        self.accounts
            .get(&account_id.to_string())
            .unwrap_or(
                self.exercises
                    .iter()
                    .fold(HashMap::new(), |mut acc, exercise| {
                        acc.insert(exercise, false);
                        acc
                    }),
            )
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::accounts;
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
    fn test_add_exercise() {
        let context = get_context(vec![], false);
        testing_env!(context);

        let mut contract = Contract::new(Vec::new());

        contract.add_exercise(0, "Exercise 1".to_string());

        let exercises = contract.exercises.to_vec();
        assert_eq!(exercises[0], "Exercise 1".to_string());

        contract.add_exercise(0, "Exercise 0".to_string());

        let exercises = contract.exercises.to_vec();
        assert_eq!(exercises[0], "Exercise 0".to_string());
        assert_eq!(exercises[1], "Exercise 1".to_string());

        contract.add_exercise(2, "Exercise 2".to_string());

        let exercises = contract.exercises.to_vec();
        assert_eq!(exercises[0], "Exercise 0".to_string());
        assert_eq!(exercises[1], "Exercise 1".to_string());
        assert_eq!(exercises[2], "Exercise 2".to_string());

        contract.add_exercise(2, "Exercise 1.5".to_string());

        let exercises = contract.exercises.to_vec();
        assert_eq!(exercises[0], "Exercise 0".to_string());
        assert_eq!(exercises[1], "Exercise 1".to_string());
        assert_eq!(exercises[2], "Exercise 1.5".to_string());
        assert_eq!(exercises[3], "Exercise 2".to_string());
    }

    #[test]
    fn test_remove_exercise() {
        let context = get_context(vec![], false);
        testing_env!(context);

        let mut contract = Contract::new(vec![
            "Exercise 0".to_string(),
            "Exercise 1".to_string(),
            "Exercise 2".to_string(),
            "Exercise 3".to_string(),
        ]);

        contract.remove_exercise(2);

        let exercises = contract.exercises.to_vec();
        assert_eq!(
            exercises,
            vec![
                "Exercise 0".to_string(),
                "Exercise 1".to_string(),
                "Exercise 3".to_string(),
            ]
        );

        contract.remove_exercise(0);

        let exercises = contract.exercises.to_vec();
        assert_eq!(
            exercises,
            vec!["Exercise 1".to_string(), "Exercise 3".to_string(),]
        );

        contract.remove_exercise(1);

        let exercises = contract.exercises.to_vec();
        assert_eq!(exercises, vec!["Exercise 1".to_string(),]);

        contract.remove_exercise(0);

        let exercises = contract.exercises.to_vec();
        assert_eq!(exercises, vec![] as Vec<String>);
    }

    #[test]
    fn test_status() {
        let context = get_context(vec![], false);
        testing_env!(context);

        let mut contract = Contract::new(vec![
            "Exercise 0".to_string(),
            "Exercise 1".to_string(),
            "Exercise 2".to_string(),
            "Exercise 3".to_string(),
        ]);

        assert_eq!(
            contract.get_status(accounts(0)),
            vec![
                ("Exercise 0".to_string(), false),
                ("Exercise 1".to_string(), false),
                ("Exercise 2".to_string(), false),
                ("Exercise 3".to_string(), false)
            ]
        );

        contract.set_status(accounts(0), 2, true);
        assert_eq!(
            contract.get_status(accounts(0)),
            vec![
                ("Exercise 0".to_string(), false),
                ("Exercise 1".to_string(), false),
                ("Exercise 2".to_string(), true),
                ("Exercise 3".to_string(), false)
            ]
        );

        contract.set_status(accounts(0), 0, true);
        assert_eq!(
            contract.get_status(accounts(0)),
            vec![
                ("Exercise 0".to_string(), true),
                ("Exercise 1".to_string(), false),
                ("Exercise 2".to_string(), true),
                ("Exercise 3".to_string(), false)
            ]
        );

        contract.set_status(accounts(0), 1, true);
        assert_eq!(
            contract.get_status(accounts(0)),
            vec![
                ("Exercise 0".to_string(), true),
                ("Exercise 1".to_string(), true),
                ("Exercise 2".to_string(), true),
                ("Exercise 3".to_string(), false)
            ]
        );

        contract.set_status(accounts(0), 2, false);
        assert_eq!(
            contract.get_status(accounts(0)),
            vec![
                ("Exercise 0".to_string(), true),
                ("Exercise 1".to_string(), true),
                ("Exercise 2".to_string(), false),
                ("Exercise 3".to_string(), false)
            ]
        );
    }
}
