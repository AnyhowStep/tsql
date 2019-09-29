https://dev.mysql.com/doc/refman/8.0/en/select.html

> The SQL standard requires that HAVING must reference only columns in the GROUP BY clause or columns used in aggregate functions.
> However, MySQL supports an extension to this behavior, and permits HAVING to refer to columns in the SELECT list and columns in outer subqueries as well.

-----

The SQL standard requires that HAVING must reference only columns,

1. in the GROUP BY clause or
2. columns used in aggregate functions.

Supporting point 1 isn't too difficult.

Supporting point 2 would involve adding something like `aggregationUsedRef` to `ExprData`.

-----

We need both `aggregationUsedRef` and `usesAggregateFunction`.

`COUNT(*)` would have `usesAggregateFunction : true` but an empty `aggregationUsedRef : IUsedRef<{}>`.

Maybe `ExprData` can have,

```ts
aggregation : undefined|{
    usedRef : IUsedRef
}
```

If `aggregation` is `undefined`, then it can be used in the `WHERE` clause.

-----

Expressions with `aggregation` set cannot be nested.

The following query is invalid,
```sql
SELECT AVG(AVG(myTableId)) FROM myTable
```

You cannot nest aggregate function calls.

-----

For an expression in the `HAVING` clause, it can only have `usedRef` that are in the `GROUP BY` clause.
It can have `usedRef` that are in the `FROM` clause.

-----

+ Aggregation functions (and expressions containing aggregation functions) cannot be used in the `WHERE` clause
+ The `HAVING/ORDER BY/SELECT` clause can only reference
    + Columns in the `GROUP BY` clause
    + Columns functionally dependent on columns in the `GROUP BY` clause
        + This means the table has a superset of its candidate key in the `GROUP BY` clause
+ The exception is that the `HAVING/ORDER BY/SELECT` clause can reference columns in the `FROM` clause if the column is being passed directly to an aggregation function
+ Queries without a `GROUP BY` clause can be treated as implicitly having a `GROUP BY` clause containing all columns in the `FROM` clause (except it doesn't remove duplicate rows)

-----

The philosophy that this library has is that a `Query` object must always be valid.
It can never be in a maybe-invalid state. Err, maybe not *never*.

Therefore, to implement this,

+ `.groupBy()` cannot be called after `HAVING/ORDER BY/SELECT` clause.
+ After `.groupBy()`, the `HAVING/ORDER BY/SELECT` clause is subject to the `GROUP BY` checks.

-----

There are just too many ways for things to go wrong and I don't quite fully understand
the implementation details of the various databases out there.

At the moment, we'll let the query object be **`GROUP BY`-unsafe** and **`Aggregation Function`-unsafe**.

So, if you write a query that is somehow dependent on `GROUP BY` rules,
or try to use an aggregation function in the `WHERE` clause,
the library may think it is safe during compile-time,
but the database may throw a run-time error.

Maybe `GROUP BY` and `Aggregation Function` safety will be revisited
if this library ever gains popularity and more experienced and knowledgeable people contribute.
