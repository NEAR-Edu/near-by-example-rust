# Wrapping Counter Contract

In the last exercise we improved the simple `Counter` smart contract utilizing the `saturating_*` methods. In this exercise we'll try an alternative approach using the `wrapping_*` methods.

## Improve increment

Update the `increment` method so that it wraps at the `i8::MAX` value.

## Improve decrement

Update the `decrement` method so that it wraps at the `i8::MIN` value.

## Resources

- [wrapping_add](https://doc.rust-lang.org/std/primitive.i8.html#method.wrapping_add)
- [wrapping_sub](https://doc.rust-lang.org/std/primitive.i8.html#method.wrapping_sub)
