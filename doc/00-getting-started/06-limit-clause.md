### `LIMIT` Clause

The `LIMIT` clause lets you specify how many rows are returned.

Using `OFFSET`, you can also skip over rows.

-----

### `number` vs `bigint`

The `.limit()` and `offset()` methods allow both `number` and `bigint` types as arguments.

However, `bigint` is recommended because it is the safer data type to use.

-----

With `number`, you have many invalid values for the `LIMIT/OFFSET` clause,
+ `NaN`
+ `Infinity`
+ `-Infinity`
+ `3.141`
+ `-1.0`
+ `1e300`
+ etc.

With `bigint`, you still have many invalid values, but they are harder to run into,
+ `-1n`
+ `100000000000000000000000000000000000000000000000000000000000000000000n`
+ etc.

-----

Using `bigint` just reduces the probability of run-time errors.

If TypeScript started implementing unsigned types or [range types](https://github.com/microsoft/TypeScript/issues/15480), we can make this safer.

-----

### Min and Max Values

For maximum compatibility between databases, the minimum value for `LIMIT/OFFSET` is `0` and the maximum value is `9223372036854775807` (`SIGNED BIGINT` max value).

MySQL supports larger values for `LIMIT/OFFSET` but this library uses `9223372036854775807` for maximum compatibility between the different databases.

The MySQL-specific library may support MySQL's full range.

-----

### `.limit()`

The `LIMIT` may be specified with,
```ts
myQuery
    .limit(1);
```

The above is the same as writing,
```sql
LIMIT
    1
OFFSET
    0
```

-----

### `.offset()`

The `OFFSET` may be specified with,
```ts
myQuery
    .limit(1337)
    .offset(69);
```

The above is the same as writing,
```sql
LIMIT
    1337
OFFSET
    69
```

-----

You may use `.offset()` without using `.limit()`,
```ts
myQuery
    .offset(69);
```

The above is the same as writing,
```sql
LIMIT
    9223372036854775807
OFFSET
    69
```
