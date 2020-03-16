### Default Supported Data Types

By default, the unified library only supports data types common to the following databases,

+ MySQL 5.7
+ SQLite 3.31
+ PostgreSQL 9.4

The following SQL data types are supported,

| TypeScript Type             | SQL Type |
|-----------------------------|----------|
| `null`                      | `NULL`
| `bigint`                    | `SIGNED INTEGER`
| `number`                    | `FLOAT`/`DOUBLE`
| `@squill/Decimal` interface | `DECIMAL`
| `boolean`                   | `BOOLEAN`
| `Date`                      | `DATETIME`, `TIMESTAMP`, etc.
| `string`                    | `CHAR`, `VARCHAR`, `TEXT`, etc.
| `Uint8Array`                | `BINARY`, `VARBINARY`, `BLOB`, `bytea`, etc.

Additional SQL data types may be supported by database-specific libraries.
You may add support for additional data types by creating custom data types.

-----

### `null`

TypeScript has `null` and `undefined` types. However, only `null` is allowed.

In general, using `undefined` where `null` is expected will cause run-time errors.

All databases support the `NULL` data type.

You may make a data type nullable by using the `.orNull()` method.

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUArgGYD2BAlgOYAWALjQHZ0DcAUAMIgpwYaeMjQVq9ZmzpQAFFyhQAtEqgA5MDHUBVJEgVkqtRi3boAJhjVCA4ihBQIIdAFk4IAJpQA0ii9xtGDB0NT4UFxRrdU0dPQAaAxVorTVdfUUAZ0kmAFNzYABDXJgaAFscqGBBFBhXFFkAZgBKZNikBMUkjRS0g3McjIBjACcaAAcWSlYoADV3HgAJd1kAFgAGAE4ANhbuto7lVTVSABsTgoAjE5yOKDYoQYKMiqYGHIBPKHMpgHImKGGOXKpQuOWGUAA7m9AQYTpRHpNWMABiNxojZvMliBVpsdm0uE1uFwxsMCnRSgUoExLtcAPoADzYVFk4mMUnYhKAA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwIpLtSRQkAGVsRkx0bG5GCABeGrg5dCI6cgAKc26+gaGRxnMASiy5IhkZAGEKyRUShYBvLOgIFf7B4dGASRkIav85GXQAIQGn7nQ9245BkCy2ABprtBqA8QQARIhBAAqqgY7yMn3QCORqIWwQhUKgOVwJDE2DUw2KbymmIAakQxIdMAyFgBGcEQAAsAAYAJwANgJNxuwGAADlJAg5vQXDwICQiGk+OQuDJigBybQFFTkFQ0dIQZKYdLkQkQFgKyncOGUUnkq3Uj5femM5liNkcnkCrZyTQShBgyE3AC+OxucjS6BgknQSH+pN15ABCyKcFOJQmAD55Sczrg5Hc1o9GC8tm4wOVpqQDLYCgtFRxuCQICnisCSFatlmIFcRcAhKQGOxEDJEXNFYVh-gRtQchBjQUsoWHhs5DP0ugALJEbgcBZmjrtq1B4VQADaZpuvdPN6gMKG8MR5BROupwOSEGxi3MACZuazuXif8gNZJEf2CSof05SpWVZOR+QAdgADgALW2E9b1PYk7QpbAqWqcxDgGBl4lwZk1BBWUkiQZJuHMDDML7bcuEYbAADcGHIAAPNQAhIQI-HQMlRggNj2EkU1GNPC1ETw61bTJXD8IsMVyAZZUIDUBkAGsNnNJB0Hoy9oGDBjb2vKToSLR8cVfap30-J8lj-ACgM5eIfx-JFWSQypgmgn8kLkWCfzQoVLOgbDFIdAi4TwIoIDYBAqJjbJJWcMypNFZimHYzieL4gTuHS0TxMkiKoBkq0bRJaK5LfdLMtPUzjKgCyIvvIIZC-F80QgByv2c-9ANg+JWQAVm8hDKnG6bWX5ORZtC9DWuFKL7XqgiABlsG0od5QZFLtGSQJMHNchGFwIyKqgUUnjQbgDL8Cj+JQbAQQ5HIUCISV0HwWN+vS1a+yquSapwmLAYQJrhRa28AF0sh2UM3CAA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgVwGYHtgBLAcwAsAXIgOxIG4g)

-----

### `bigint`
