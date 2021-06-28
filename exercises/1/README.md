# Counter Contract

Implement a Smart Contract that can `increment`, `decrement`, and `reset` a `val`.

## get_num

The `get_num` smart contract method should return the current counter `val`. The counter struct is accessible via `self`.

## increment

The `increment` smart contract method should increment `val` by `1`. It is a mutable method (because it changes `val`). In Rust we need to explicitly state that `increment` can mutate the data held in the `Counter` struct by mutably borrowing `self` with `&mut self` as the first parameter in the method signature.

## decrement

The `decrement` smart contract method should decrement `val` by `1`. Like `increment`, it is a mutable method.

## reset

The `reset` smart contract method should reset `val` to `0`. Like `increment` and `decrement`, it is a mutable method.

## Resources

- [Rust Book - Data Types](https://ferrous-systems.github.io/teaching-material/basic-types.html#)
- [Rust Book - Structs](https://doc.rust-lang.org/book/ch05-01-defining-structs.html)
- [Rust Book - Method Syntax](https://doc.rust-lang.org/book/ch05-03-method-syntax.html)
- [Ferrous Systems - Basic Type](https://ferrous-systems.github.io/teaching-material/basic-types.html)
- [Ferrous Systems - Compound Types](https://ferrous-systems.github.io/teaching-material/compound-types.html#/)
