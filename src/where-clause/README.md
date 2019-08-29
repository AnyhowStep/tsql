Aggregate functions are not allowed in the `WHERE` clause.

However, at the moment, we do not have this compile-time check.

-----

We can achieve this check by adding something like `usesAggregateFunction` to `ExprData`.

However... This has not been done yet.
