### Data Types

This library is **highly opinionated** when it comes to mapping types between databases and TypeScript.

In general, this library only supports data types common to the following databases,
+ MySQL 5.7
+ SQLite 3.28
+ PostgreSQL 9.4

At the moment, the following database data types are supported,

Database Type       | TypeScript Type
--------------------|----------------
`NULL`              | `null`
`SIGNED INTEGER`    | `bigint`
`DOUBLE`            | `number`
`VARCHAR`           | `string`
`BOOLEAN`           | `boolean`
`DATETIME`          | `Date`
`BLOB`              | `Buffer`
`DECIMAL`           | A custom `Decimal` interface

-----

### `NULL`

TypeScript has `null` and `undefined` types.
However, only `null` is allowed.

In general, using `undefined` where `null` is expected will cause run-time errors.

All databases support the `NULL` data type

-----

### `SIGNED INTEGER`

MySQL has `UNSIGNED` integers but PostgreSQL and SQLite do not.
Therefore, this library does not support `UNSIGNED` integer types.
The MySQL-specific library may add support for `UNSIGNED` integer types.

Attempting to use literal values outside the range of
`[-9223372036854775808, 9223372036854775807]` (A signed 8-byte integer AKA `SIGNED BIGINT`)
will cause a run-time error to be thrown, in general.


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

### `DOUBLE`



-----

### `VARCHAR`

-----

### `BOOLEAN`

-----

### `DATETIME`

-----

### `BLOB`

-----

### `DECIMAL`
