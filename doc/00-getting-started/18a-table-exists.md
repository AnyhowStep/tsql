### `table.existsXxx()`

A collection of convenience methods to check if a row exists on a table.

-----

### `table.existsByPrimaryKey()`

Every table **should** have one primary key.
The primary key may be made up of one, or more, columns.
```ts
const exists : boolean = await myTable.existsByPrimaryKey(
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
const exists : boolean = await tsql.from(myTable)
    .whereEqPrimaryKey(
        tables => tables.myTable,
        {
            myTablePrimaryKey0,
            myTablePrimaryKey1,
            //etc.
        }
    )
    .exists(connection);
```

-----

### `table.existsByCandidateKey()`

A primary key **should** be a kind of candidate key.
Therefore, every table **should** have one, or more, candidate keys.
A candidate key may be made up of one, or more, columns.

```ts
const exists : boolean = await myTable.existsByCandidateKey(
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
const exists : boolean = await tsql.from(myTable)
    .whereEqCandidateKey(
        tables => tables.myTable,
        {
            myTableCandidateKey0,
            myTableCandidateKey1,
            //etc.
        }
    )
    .exists(connection);
```

-----

### `table.existsBySuperKey()`

A super key is made up of a candidate key and zero, or more, non-key columns.
```ts
const exists : boolean = await myTable.existsBySuperKey(
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
const exists : boolean = await tsql.from(myTable)
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
    .exists(connection);
```

-----

### `table.exists(connection, whereDelegate)`

Checks if a row exists on a table, matching an arbitrary condition.
```ts
const exists : boolean = await myTable.exists(
    connection,
    columns => tsql.gt(
        columns.myColumn,
        9001n
    )
);
```

Convenience method for,
```ts
const exists : boolean = await tsql.from(myTable)
    .where(columns => tsql.gt(
        columns.myColumn,
        9001n
    ))
    .exists(connection);
```

-----

### `table.assertExistsXxx()`

A collection of convenience methods to assert a row exists on a table.

-----

### `table.assertExistsByPrimaryKey()`

Every table **should** have one primary key.
The primary key may be made up of one, or more, columns.
```ts
await myTable.assertExistsByPrimaryKey(
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
await tsql.from(myTable)
    .whereEqPrimaryKey(
        tables => tables.myTable,
        {
            myTablePrimaryKey0,
            myTablePrimaryKey1,
            //etc.
        }
    )
    .assertExists(connection);
```

-----

### `table.assertExistsByCandidateKey()`

A primary key **should** be a kind of candidate key.
Therefore, every table **should** have one, or more, candidate keys.
A candidate key may be made up of one, or more, columns.

```ts
await myTable.assertExistsByCandidateKey(
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
await tsql.from(myTable)
    .whereEqCandidateKey(
        tables => tables.myTable,
        {
            myTableCandidateKey0,
            myTableCandidateKey1,
            //etc.
        }
    )
    .assertExists(connection);
```

-----

### `table.assertExistsBySuperKey()`

A super key is made up of a candidate key and zero, or more, non-key columns.
```ts
await myTable.assertExistsBySuperKey(
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
await tsql.from(myTable)
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
    .assertExists(connection);
```

-----

### `table.assertExists(connection, whereDelegate)`

Asserts a row exists on a table, matching an arbitrary condition.
```ts
await myTable.assertExists(
    connection,
    columns => tsql.gt(
        columns.myColumn,
        9001n
    )
);
```

Convenience method for,
```ts
await tsql.from(myTable)
    .where(columns => tsql.gt(
        columns.myColumn,
        9001n
    ))
    .assertExists(connection);
```
