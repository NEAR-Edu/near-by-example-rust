# Counter Contract

Implement a Smart Contract that can `increment`, `decrement`, and `reset` a `val`.

## get_num

The `get_num` smart contract method should return the current counter `val`. The counter struct is assessible via `self`.

## increment

The `increment` smart contract method should increment `val` by one. It is a mutable method (because it changes `val`). In Rust we need to explicitly state that `increment` can mutate the data held in the `Counter` struct by mutably borrowing `self` with `&mut self` as the first parameter in the method signature.
