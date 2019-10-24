### `table.fetchValueXxx()`

A collection of convenience methods to fetch a single value from a table, at most.

All these methods return an instance of type [`ExecutionUtil.FetchValuePromise<>`](/doc/00-getting-started/14-fetch-value-xxx.md#executionutilfetchvaluepromise)

-----

### `table.fetchValueByPrimaryKey()`

Every table **should** have one primary key.
The primary key may be made up of one, or more, columns.
```ts
const value = await myTable.fetchValueByPrimaryKey(
    connection,
    {
        myTablePrimaryKey0,
        myTablePrimaryKey1,
        //etc.
    },
    columns => tsql.gt(columns.myColumn, 9000n)
);
```

Convenience method for,
```ts
const value = await tsql.from(myTable)
    .whereEqPrimaryKey(
        tables => tables.myTable,
        {
            myTablePrimaryKey0,
            myTablePrimaryKey1,
            //etc.
        }
    )
    .selectValue(columns => tsql.gt(columns.myColumn, 9000n))
    .fetchValue(connection);
```

-----

### `table.fetchValueByCandidateKey()`

A primary key **should** be a kind of candidate key.
Therefore, every table **should** have one, or more, candidate keys.
A candidate key may be made up of one, or more, columns.

```ts
const value = await myTable.fetchValueByCandidateKey(
    connection,
    {
        myTableCandidateKey0,
        myTableCandidateKey1,
        //etc.
    },
    columns => tsql.gt(columns.myColumn, 9000n)
);
```

Convenience method for,
```ts
const value = await tsql.from(myTable)
    .whereEqCandidateKey(
        tables => tables.myTable,
        {
            myTableCandidateKey0,
            myTableCandidateKey1,
            //etc.
        }
    )
    .selectValue(columns => tsql.gt(columns.myColumn, 9000n))
    .fetchValue(connection);
```

-----

### `table.fetchValueBySuperKey()`

A super key is made up of a candidate key and zero, or more, non-key columns.
```ts
const value = await myTable.fetchValueBySuperKey(
    connection,
    {
        myTableCandidateKey0,
        myTableCandidateKey1,
        //etc.
        nonKey0,
        nonKey1,
        //etc.
    },
    columns => tsql.gt(columns.myColumn, 9000n)
);
```

Convenience method for,
```ts
const value = await tsql.from(myTable)
    .whereEqSuperKey(
        tables => tables.myTable,
        {
            myTableCandidateKey0,
            myTableCandidateKey1,
            //etc.
            nonKey0,
            nonKey1,
            //etc.
        }
    )
    .selectValue(columns => tsql.gt(columns.myColumn, 9000n))
    .fetchValue(connection);
```

-----

### `table.fetchValue(connection, whereDelegate, selectValueDelegate)`

Fetches a value from a table, matching an arbitrary condition.
```ts
const value = await myTable.fetchValue(
    connection,
    columns => tsql.gt(
        columns.myColumn,
        9001n
    ),
    columns => tsql.gt(columns.myColumn, 9000n)
);
```

Convenience method for,
```ts
const value = await tsql.from(myTable)
    .where(columns => tsql.gt(
        columns.myColumn,
        9001n
    ))
    .selectValue(columns => tsql.gt(columns.myColumn, 9000n))
    .fetchValue(connection);
```
