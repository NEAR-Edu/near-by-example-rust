# Status Message

Implement a Smart Contract that can `set_status` and `get_status` using a `LookupMap`.

## set_status

The `set_status` smart contract method should `insert` a message into the `self.records` `LookupMap`.

## get_status

The `get_status` smart contract method should get a message stored at the `account_id` key inside the `self.records` `LookupMap`.

## Resources

- [LookupMap](https://docs.rs/near-sdk/3.1.0/near_sdk/collections/struct.LookupMap.html)
