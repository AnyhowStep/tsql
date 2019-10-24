### `table.fetchOneXxx()`

A collection of convenience methods to fetch a single row from a table, at most.

All these methods return an instance of type [`ExecutionUtil.FetchOnePromise<>`](/doc/00-getting-started/12-fetch-one-xxx.md#executionutilfetchonepromise)

-----

### `table.fetchOneByPrimaryKey()`

Every table **should** have one primary key.
The primary key may be made up of one, or more, columns.
```ts
const row = await myTable.fetchOneByPrimaryKey(
    connection,
    {
        myTablePrimaryKey0,
        myTablePrimaryKey1,
        //etc.
    }
);
```

Convenience method for,
```ts
const row = await tsql.from(myTable)
    .whereEqPrimaryKey(
        tables => tables.myTable,
        {
            myTablePrimaryKey0,
            myTablePrimaryKey1,
            //etc.
        }
    )
    .select(columns => [columns])
    .fetchOne(connection);
```

-----

You may also specify a `SELECT` clause,
```ts
const row = await myTable.fetchOneByPrimaryKey(
    connection,
    {
        myTablePrimaryKey0,
        myTablePrimaryKey1,
        //etc.
    },
    columns => [
        columns.myColumn,
        tsql.integer.add(
            columns.myColumn,
            42n
        ).add("mySum"),
    ]
);
```

Convenience method for,
```ts
const row = await tsql.from(myTable)
    .whereEqPrimaryKey(
        tables => tables.myTable,
        {
            myTablePrimaryKey0,
            myTablePrimaryKey1,
            //etc.
        }
    )
    .select(columns => [
        columns.myColumn,
        tsql.integer.add(
            columns.myColumn,
            42n
        ).add("mySum"),
    ])
    .fetchOne(connection);
```

-----

### `table.fetchOneByCandidateKey()`

A primary key **should** be a kind of candidate key.
Therefore, every table **should** have one, or more, candidate keys.
A candidate key may be made up of one, or more, columns.

```ts
const row = await myTable.fetchOneByCandidateKey(
    connection,
    {
        myTableCandidateKey0,
        myTableCandidateKey1,
        //etc.
    }
);
```

Convenience method for,
```ts
const row = await tsql.from(myTable)
    .whereEqCandidateKey(
        tables => tables.myTable,
        {
            myTableCandidateKey0,
            myTableCandidateKey1,
            //etc.
        }
    )
    .select(columns => [columns])
    .fetchOne(connection);
```

-----

You may also specify a `SELECT` clause,
```ts
const row = await myTable.fetchOneByCandidateKey(
    connection,
    {
        myTableCandidateKey0,
        myTableCandidateKey1,
        //etc.
    },
    columns => [
        columns.myColumn,
        tsql.integer.add(
            columns.myColumn,
            42n
        ).add("mySum"),
    ]
);
```

Convenience method for,
```ts
const row = await tsql.from(myTable)
    .whereEqCandidateKey(
        tables => tables.myTable,
        {
            myTableCandidateKey0,
            myTableCandidateKey1,
            //etc.
        }
    )
    .select(columns => [
        columns.myColumn,
        tsql.integer.add(
            columns.myColumn,
            42n
        ).add("mySum"),
    ])
    .fetchOne(connection);
```

-----

### `table.fetchOneBySuperKey()`

A super key is made up of a candidate key and zero, or more, non-key columns.
```ts
const row = await myTable.fetchOneBySuperKey(
    connection,
    {
        myTableCandidateKey0,
        myTableCandidateKey1,
        //etc.
        nonKey0,
        nonKey1,
        //etc.
    }
);
```

Convenience method for,
```ts
const row = await tsql.from(myTable)
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
    .select(columns => [columns])
    .fetchOne(connection);
```

-----

You may also specify a `SELECT` clause,
```ts
const row = await myTable.fetchOneBySuperKey(
    connection,
    {
        myTableCandidateKey0,
        myTableCandidateKey1,
        //etc.
        nonKey0,
        nonKey1,
        //etc.
    },
    columns => [
        columns.myColumn,
        tsql.integer.add(
            columns.myColumn,
            42n
        ).add("mySum"),
    ]
);
```

Convenience method for,
```ts
const row = await tsql.from(myTable)
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
    .select(columns => [
        columns.myColumn,
        tsql.integer.add(
            columns.myColumn,
            42n
        ).add("mySum"),
    ])
    .fetchOne(connection);
```

-----

### `table.fetchOne(connection, whereDelegate)`

Fetches a row from a table, matching an arbitrary condition.
```ts
const row = await myTable.fetchOne(
    connection,
    columns => tsql.gt(
        columns.myColumn,
        9001n
    )
);
```

Convenience method for,
```ts
const row = await tsql.from(myTable)
    .where(columns => tsql.gt(
        columns.myColumn,
        9001n
    ))
    .select(columns => [columns])
    .fetchOne(connection);
```

-----

You may also specify a `SELECT` clause,
```ts
const row = await myTable.fetchOne(
    connection,
    columns => tsql.gt(
        columns.myColumn,
        9001n
    ),
    columns => [
        columns.myColumn,
        tsql.integer.add(
            columns.myColumn,
            42n
        ).add("mySum"),
    ]
);
```

Convenience method for,
```ts
const row = await tsql.from(myTable)
    .where(columns => tsql.gt(
        columns.myColumn,
        9001n
    ))
    .select(columns => [
        columns.myColumn,
        tsql.integer.add(
            columns.myColumn,
            42n
        ).add("mySum"),
    ])
    .fetchOne(connection);
```
