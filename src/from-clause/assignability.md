`FROM` clause A,
```sql
FROM
    tableA
CROSS JOIN
    tableB
```

-----

`FROM` clause B,
```sql
FROM
    tableA
```

-----

Ignoring `JOIN` conditions,

-----

Is `A` assignable to `B`?

No.

```ts
B = A;
/**
 * Compile-time: OK
 * Run-time    : Error, tableB already used in same-query JOIN
 */
B.crossJoin(tableB);
```

-----

Is `B` assignable to `A`?

No.

It is missing `tableB`
