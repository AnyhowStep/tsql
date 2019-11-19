### Data Types

This library is **highly opinionated** when it comes to mapping types between SQL and TypeScript.

In general, this library only supports data types common to the following databases,
+ MySQL 5.7
+ SQLite 3.28
+ PostgreSQL 9.4

At the moment, the following SQL data types are supported,

SQL Type                    | TypeScript Type
----------------------------|----------------
`NULL`                      | `null`
`SIGNED INTEGER`            | `bigint`
`FLOAT`,`DOUBLE`            | `number`
`DECIMAL`                   | A custom `Decimal` interface
`BOOLEAN`                   | `boolean`
`DATETIME`                  | `Date`
`CHAR`,`VARCHAR`,`TEXT`     | `string`
`BINARY`,`VARBINARY`,`BLOB` | `Uint8Array`

Additional SQL data types may be supported by database-specific libraries.

-----

### `NULL`

TypeScript has `null` and `undefined` types.
However, only `null` is allowed.

In general, using `undefined` where `null` is expected will cause run-time errors.

All databases support the `NULL` data type.

-----

### `SIGNED INTEGER`

MySQL has `UNSIGNED` integers but PostgreSQL and SQLite do not.
Therefore, this library does not support `UNSIGNED` integer types.
The MySQL-specific library may add support for `UNSIGNED` integer types.

-----

Attempting to use literal values outside the range of
`[-9223372036854775808, 9223372036854775807]` (A signed 8-byte integer AKA `SIGNED BIGINT`)
will cause a run-time error to be thrown, in general.

-----

Database    | `SIGNED INTEGER` types
------------|-----------------------
MySQL       | 1,2,3,4,8 byte signed integer (`TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT`, `BIGINT`)
PostgreSQL  | 2,4,8 byte signed integer (`SMALLINT`, `INT`, `BIGINT`)
SQLite      | 1,2,3,4,6,8 byte signed integer (`INTEGER`) on disk. 8 byte signed integer in memory.

References:
+ https://dev.mysql.com/doc/refman/5.7/en/integer-types.html
+ https://www.postgresql.org/docs/9.4/datatype-numeric.html#DATATYPE-INT
+ https://www.sqlite.org/datatype3.html#storage_classes_and_datatypes

-----

All `SIGNED INTEGER` types **SHOULD** have a Typescript type of `bigint`. Even 1 byte signed integers.

If this convention is not followed, this library makes no guarantees regarding the consistency of query results.

-----

### `FLOAT`,`DOUBLE`

This library makes no distinction between 4-byte and 8-byte floating-point numbers.
You may use both in expressions of TypeScript type `number`.

However, it is recommended that you stick to just using 8-byte floating-point numbers everywhere
for consistency as SQLite and JavaScript do not natively support 4-byte floating-point numbers.

Also, mixing 4-byte and 8-byte floating-point numbers may give different results compared to
using just 8-byte floating-point numbers due to differences in precision.

-----

Database    | Floating-point number types
------------|-----------------------
MySQL       | 4,8 byte floating-point number (`FLOAT`, `DOUBLE`)
PostgreSQL  | 4,8 byte floating-point number (`REAL`, `DOUBLE PRECISION`)
SQLite      | 8 byte floating-point number (`REAL`)

References:
+ https://dev.mysql.com/doc/refman/5.7/en/floating-point-types.html
+ https://www.postgresql.org/docs/9.4/datatype-numeric.html#DATATYPE-FLOAT
+ https://www.sqlite.org/datatype3.html#storage_classes_and_datatypes

-----

All `FLOAT`,`DOUBLE` types **SHOULD** have a Typescript type of `number`.

If this convention is not followed, this library makes no guarantees regarding the consistency of query results.

-----

### `DECIMAL`

JavaScript does not have a native fixed-point number type.

Therefore, this library uses a minimal interface to represent a SQL `DECIMAL` type,
```ts
interface Decimal {
    /**
     * This is the only method a `DECIMAL` type is expected to have.
     * You may use the string representation to convert to a `number|string|bigint`,
     * or use a library implementing arbitrary precision decimal types.
     */
    toString () : string;
    /**
     * A brand that marks this as a SQL `DECIMAL` type.
     * This property will not exist during run-time.
     */
    $isDecimal : void;
}
```

-----

The `tsql.decimalLiteral(rawDecimalLiteral, precision, scale)` function may be used
to convert `string|number|bigint|Decimal` values into an expression of SQL type `DECIMAL`.

-----

Database    | Fixed-point number types
------------|-----------------------
MySQL       | Precision : [0, 65], Scale : [0, 30]
PostgreSQL  | Precision : [1, 1000], Scale : [0, 1000]
SQLite      | Unsupported

References:
+ https://dev.mysql.com/doc/refman/5.7/en/fixed-point-types.html
+ https://www.postgresql.org/docs/9.4/datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL
+ https://www.sqlite.org/datatype3.html#storage_classes_and_datatypes

-----

Although SQLite does not natively support `DECIMAL` types, the `@tsql/sqlite-3.28` library should polyfill it.

This library imposes the following constraints on `DECIMAL` types, in its attempt to unify behaviour,
+ Precision : [1, 65]
+ Scale : [0, min(30, precision)]

Database-specific libraries may impose a different precision/scale constraint.

-----

All `DECIMAL` types **SHOULD** have a Typescript type of the `Decimal` interface.

If this convention is not followed, this library makes no guarantees regarding the consistency of query results.

-----

### `BOOLEAN`

Although MySQL and SQLite do not **truly** have a `BOOLEAN` type,
and emulate it with integers instead,
the operations on this emulated type behave exactly like a `BOOLEAN` type.

-----

Database    | Boolean types
------------|-----------------------
MySQL       | `FALSE = 0`, `TRUE = 1` (`INTEGER`)
PostgreSQL  | `BOOLEAN`
SQLite      | `FALSE = 0`, `TRUE = 1` (`INTEGER`)

References:
+ https://dev.mysql.com/doc/refman/5.7/en/boolean-literals.html
+ https://www.postgresql.org/docs/9.4/datatype-boolean.html
+ https://www.sqlite.org/datatype3.html#storage_classes_and_datatypes

-----

All `BOOLEAN` types (even emulated ones) **SHOULD** have a Typescript type of `boolean`.

If this convention is not followed, this library makes no guarantees regarding the consistency of query results.

-----

### `DATETIME`

Although MySQL and PostgreSQL support `DATETIME` types with microsecond precision,
this library only really supports up to millisecond precision because JavaScript's
`Date` type only has up to millisecond precision.

SQLite also only has up to millisecond precision.

-----

Attempting to use microseconds with this library will cause a loss in precision.

-----

You should avoid using the `TIMESTAMP` type with MySQL because
it has a range of `'1970-01-01 00:00:01' UTC` to `'2038-01-19 03:14:07' UTC`.

-----

Database    | Date-Time types
------------|-----------------------
MySQL       | `DATETIME(p)` where `p` is one of `0,1,2,3,4,5,6` (microsecond precision)
PostgreSQL  | `TIMESTAMP(p)` where `p` is one of `0,1,2,3,4,5,6` (microsecond precision)
SQLite      | Unsupported. `strftime()` may be used to get a `TEXT` representing a `DATETIME` with precision up to `3` (millisecond precision)

References:
+ https://dev.mysql.com/doc/refman/5.7/en/datetime.html
+ https://www.postgresql.org/docs/9.4/datatype-datetime.html#DATATYPE-DATETIME-TABLE
+ https://www.sqlite.org/datatype3.html#storage_classes_and_datatypes
+ https://www.sqlite.org/lang_datefunc.html

-----

All `DATETIME` types (even emulated ones) **SHOULD** have a Typescript type of `Date`.

If this convention is not followed, this library makes no guarantees regarding the consistency of query results.

-----

### `CHAR`,`VARCHAR`,`TEXT`

**TODO** : Character set handling

-----

Database    | String types
------------|-----------------------
MySQL       | `CHAR`, `VARCHAR`, `TEXT`
PostgreSQL  | `CHAR`, `VARCHAR`, `TEXT`
SQLite      | `TEXT`

References:
+ https://dev.mysql.com/doc/refman/5.7/en/char.html
+ https://dev.mysql.com/doc/refman/5.7/en/blob.html
+ https://www.postgresql.org/docs/9.4/datatype-character.html
+ https://www.sqlite.org/datatype3.html#storage_classes_and_datatypes

-----

All `CHAR`,`VARCHAR`,`TEXT` types **SHOULD** have a Typescript type of `string`.

If this convention is not followed, this library makes no guarantees regarding the consistency of query results.

-----

### `BINARY`,`VARBINARY`,`BLOB`

Database    | String types
------------|-----------------------
MySQL       | `BINARY`, `VARBINARY`, `BLOB`
PostgreSQL  | `bytea`
SQLite      | `BLOB`

References:
+ https://dev.mysql.com/doc/refman/5.7/en/binary-varbinary.html
+ https://dev.mysql.com/doc/refman/5.7/en/blob.html
+ https://www.postgresql.org/docs/9.4/datatype-binary.html
+ https://www.sqlite.org/datatype3.html#storage_classes_and_datatypes

-----

All `BINARY`,`VARBINARY`,`BLOB` types **SHOULD** have a Typescript type of `Uint8Array`.

If this convention is not followed, this library makes no guarantees regarding the consistency of query results.

-----

`node` libraries may use `Buffer`. This is fine because `Buffer extends Uint8Array`.
