### Derived Table

A query may be used as a derived table,
```ts
const myQuery = tsql
    .from(myTable)
    .crossJoin(
        //This is a query
        tsql.from(otherTable)
            .select(columns => [
                columns.otherColumn0,
                columns.otherColumn1,
                columns.otherColumn2,
                //etc.
            ])
            //This converts the query into a derived table
            .as("derivedTable")
    );
```

-----

### `LATERAL`

MySQL 5.7 does not support the `LATERAL` keyword.
Therefore, the query builder in this library does not support `LATERAL`, either.

However, the PostgreSQL-specific library should.
