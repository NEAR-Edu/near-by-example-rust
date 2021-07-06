# Saturating Counter Contract

In the last exercise we implemented a simple `Counter` smart contract. In this exercise we'll improve that contract by adding some overflow safety.

Since the `Counter` uses an `i8` the minimum `self.val` is `-128` and the maximum is `127`. If we try to `decrement` or `increment` outside the minimum or maximum an overflow will occur. This can be prevented by using the `saturating_*` methods.

## Improve increment

Update the `increment` method so that it saturates at the `i8::MAX` value.

## Improve decrement

Update the `decrement` method so that it saturates at the `i8::MIN` value.

## Resources

- [saturating_add](https://doc.rust-lang.org/std/primitive.i8.html#method.saturating_add)
- [saturating_sub](https://doc.rust-lang.org/std/primitive.i8.html#method.saturating_sub)
