### Compound Query (`UNION`/`INTERSECT`/`EXCEPT`)

Compound queries let you combine multiple result sets into one.

-----

This library only supports `UNION` because MySQL only supports `UNION`.

The PostgreSQL and SQLite-specific libraries should support `INTERSECT` and `EXCEPT`.

-----

Compound queries are subject to some constraints outlined [here](/doc/00-getting-started/04-select-clause.md#interaction-with-compound-queries-unionintersectexcept)

-----

### `.unionDistinct()`

```ts
queryA
    .unionDistinct(queryB)
    .unionDistinct(queryC);
```

The above is the same as writing,
```sql
-- queryA
UNION DISTINCT
-- queryB
UNION DISTINCT
-- queryC
```

-----

### `.unionAll()`

```ts
queryA
    .unionAll(queryB)
    .unionAll(queryC);
```

The above is the same as writing,
```sql
-- queryA
UNION ALL
-- queryB
UNION ALL
-- queryC
```
