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
| JS `Date`                   | `DATETIME`, `TIMESTAMP`, etc.
| `string`                    | `CHAR`, `VARCHAR`, `TEXT`, etc.
| `Uint8Array`                | `BINARY`, `VARBINARY`, `BLOB`, `bytea`, etc.

Additional SQL data types may be supported by database-specific libraries.
You may add support for additional data types by creating custom data types.

-----

Data types in this library have the `dt` prefix.

-----

### `null`

TypeScript has `null` and `undefined` types. However, only `null` is allowed.

In general, using `undefined` where `null` is expected will cause run-time errors.

All databases support the `NULL` data type.

You may make a data type nullable by using the `.orNull()` method.

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUArgGYD2BAlgOYAWALjQHZ0DcAUAMIgpwYaeMjQVq9ZmzpQAFFyhQAtEqgA5MDHUBVJEgVkqtRi3boAJhjVCA4ihBQIIdAFk4IAJpQA0ii9xtGDB0NT4UFxRrdU0dPQAaAxVorTVdfUUAZ0kmAFNzYABDXJgaAFscqGBBFBhXFFkAZgBKZNikBMUkjRS0g3McjIBjACcaAAcWSlYoADV3HgAJd1kAFgAGAE4ANhbuto7lVTVSABsTgoAjE5yOKDYoQYKMiqYGHIBPKHMpgHImKGGOXKpQuOWGUAA7m9AQYTpRHpNWMABiNxojZvMliBVpsdm0uE1uFwxsMCnRSgUoExLtcAPoADzYVFk4mMUnYhKAA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwIpLtSRQkAGVsRkx0bG5GCABeGrg5dCI6cgAKc26+gaGRxnMASiy5IhkZAGEKyRUShYBvLOgIFf7B4dGASRkIav85GXQAIQGn7nQ9245BkCy2ABprtBqA8QQARIhBAAqqgY7yMn3QCORqIWwQhUKgOVwJDE2DUw2KbymmIAakQxIdMAyFgBGcEQAAsAAYAJwANgJNxuwGAADlJAg5vQXDwICQiGk+OQuDJigBybQFFTkFQ0dIQZKYdLkQkQFgKyncOGUUnkq3Uj5femM5liNkcnkCrZyTQShBgyE3AC+OxucjS6BgknQSH+pN15ABCyKcFOJQmAD55Sczrg5Hc1o9GC8tm4wOVpqQDLYCgtFRxuCQICnisCSFatlmIFcRcAhKQGOxEDJEXNFYVh-gRtQchBjQUsoWHhs5DP0ugALJEbgcBZmjrtq1B4VQADaZpuvdPN6gMKG8MR5BROupwOSEGxi3MACZuazuXif8gNZJEf2CSof05SpWVZOR+QAdgADgALW2E9b1PYk7QpbAqWqcxDgGBl4lwZk1BBWUkiQZJuHMDDML7bcuEYbAADcGHIAAPNQAhIQI-HQMlRggNj2EkU1GNPC1ETw61bTJXD8IsMVyAZZUIDUBkAGsNnNJB0Hoy9oGDBjb2vKToSLR8cVfap30-J8lj-ACgM5eIfx-JFWSQypgmgn8kLkWCfzQoVLOgbDFIdAi4TwIoIDYBAqJjbJJWcMypNFZimHYzieL4gTuHS0TxMkiKoBkq0bRJaK5LfdLMtPUzjKgCyIvvIIZC-F80QgByv2c-9ANg+JWQAVm8hDKnG6bWX5ORZtC9DWuFKL7XqgiABlsG0od5QZFLtGSQJMHNchGFwIyKqgUUnjQbgDL8Cj+JQbAQQ5HIUCISV0HwWN+vS1a+yquSapwmLAYQJrhRa28AF0sh2UM3CAA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgVwGYHtgBLAcwAsAXIgOxIG4g)

-----

### `bigint`

MySQL has `UNSIGNED` integers but PostgreSQL and SQLite do not.
Therefore, this library does not support `UNSIGNED` integer types.
The MySQL-specific library may add support for `UNSIGNED` integer types.

-----

Attempting to use literal values outside the range of
`[-9223372036854775808, 9223372036854775807]` (A signed 8-byte integer AKA `BIGINT SIGNED`)
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

The following `bigint` data types are supported,

| `@squill/squill`      | MySQL              | PostgreSQL | SQLite    | Size   | Min Value | Max Value |
|-----------------------|--------------------|------------|-----------|--------|-----------|-----------|
| `dtTinyIntSigned()`   | `TINYINT SIGNED`   | `smallint` | `INTEGER` | 1 byte |-128; `-(2^7)` | 127; `(2^7)-1`
| `dtSmallIntSigned()`  | `SMALLINT SIGNED`  | `smallint` | `INTEGER` | 2 byte | -32,768; `-(2^15)` | 32,767; `(2^15)-1`
| `dtMediumIntSigned()` | `MEDIUMINT SIGNED` | `integer`  | `INTEGER` | 3 byte | -8,388,608; `-(2^23)` | 8,388,607; `(2^23)-1`
| `dtIntSigned()`       | `INT SIGNED`       | `integer`  | `INTEGER` | 4 byte | -2,147,483,648; `-(2^31)`| 2,147,483,647; `(2^31)-1`
| `dtBigIntSigned()`    | `BIGINT SIGNED`    | `bigint`   | `INTEGER` | 8 byte | -9,223,372,036,854,775,808; `-(2^63)` | 9,223,372,036,854,775,807; `(2^63)-1`

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUADgPbkBOEAplQM7kB2A3AFADCIKcMa8ZGgrU6jFlAAU7KGUo16TZugAmGAHL8A4ihBQIIdAFk4IAJpQA0igtwAqjDDp13FEZSao6sDC92kSAA0MlDMAIYAtrRQAGqmnAASppIALAAMAJwAbACUXj5+AcGyALQlUADq0QDuAJYANvVQAK4M0SoALjC1zACe6MwdBLUA5sy0KpJ5HeRQAG5h9bUqYR3RHQAWtQwhZV7ka1Cbq0cb0VRhzCPRAMZnNwDWUCz1vVC0AB7bHQzPzKe3Ja0Qa7cqXNTMA4AqArDphABGYTaADpUSEbkiNmBmAlwRptLp8r51P4kFAAPQAKkSKE4lmkAEgMQwsTi8QA+AC8UBKAEYAEwADigcHUwCgzNZuOYagAPNyBQB2EI5Snk9g5DjsUgXEYRMJHBH1WgAfS+zAAZuRJCIFOJmJqgA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwIpKyprEBdNxiiABeGrg5dCI6cgAKc3KevuLzAEosuSIZGQBhCskVEqmAbyzoCDnesX7uAEkZCGr-ORl0ACFsRivudABlN+5yGSmSwANMdoNwiCoGPcjI90AA1IhiTaYRFTACMQIgABYAAwATgAbMDQVBgMA0QAmADsEBURAAHiSICQiLhMAB5bgACSIsjuI1hABVsNwOB9vr9-oCQScAL4rE5yNLoGCSdBID4kAqQz5TIpwXYlIYAPmZOz2uDkZwW1xkSzcYHKo1IBlsBSmrI43BIED1xT+JHQ2GKSxNECOJzJQlIDHYiBkRHGbDSzLj+BF1ByEEw6XIWSIySIgVO3XOlzkGfS6E50yZHQDQeKMpO0AjLfb4Mh-PMz1Y5mb7cjwEamggvZoQymTJOLLZnJ5fOqr3euspRIHLdlWXtihOBaLXU0ZeKFZKVZrU8HZu4DeD3A3JzbV6gnahFkFEX70+gUe6EA-ZiDJez5QLOHLcrytxLm84rotSxJXluJw7lk6BiFwT4tvuxbWhcJ6VloF7fqB-q5I297EeGlEnK+3YANLkNwX4ge2ZIMbwaHYJQGBIBAlAsmoDAaAAblWHCYjQaphEWcC4NR0BgfOkH8susGUgAHAhLFIYOO5yqm6AkJgvrpGIoaYUOgo5tkiYTKyDDJFIcC3CionEGQ5BqEEtwaUyZKSdoeRcZ88SZgwwnsNgCbkX46pqIJtyBAoV5klySDJOQoliJigQAOT4DQlDaOqxBwIWHD4BFATRXmKXAFgIqMPgAxYAw0V2SmNBcJI1DcIwfn1dZYhvJg2jtRgHCCZio6bFyACimx0depRiEWnxyVeHT9PQcimZowEgeYmwBIx6ChVF4WRdFd7SXY-zMSxplMnp0BbmA8puEAA#post-ts/LTAEBEEsCcFMGMAuAbAnqWAPBBXRtQBlARQBkAaUAOwHtR5lJYrFgBnSAEwIDcBDRpz6JINKqGg4qAKACSAOUIBRAEoAVUArUB5UAAcaNaAAVY0NmNAAKaQEgqfALaxy00KFvw+bABbaqABJ8VJzSAJSgAGoAgqQAqkqE0lYA5EHwANZmjsEplACchUVFYQDc0tLKpEoAwhoAVKAAYiraALL6hiZmFlTlQA)

-----

The `bigIntSignedLiteral(rawBigIntSignedLiteral)` function may be used
to convert `string|number|bigint|Decimal` values into an expression of SQL type `BIGINT SIGNED` (And other integer types).

[TODO Code Sample]()

-----

### `number`

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

The following `number` data types are supported,

| `@squill/squill`      | MySQL              | PostgreSQL         | SQLite    | Size   |
|-----------------------|--------------------|--------------------|-----------|--------|
| `dtFloat()`           | `FLOAT`            | `real`             | `REAL`    | 4 byte |
| `dtDouble()`          | `DOUBLE`           | `double precision` | `REAL`    | 8 byte |

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUARgIYAulApgE4CeSNAbjQDYDcAUAMIgo4MNPGRoK1ek1YcoACm4BICbUboAJlABqcELwASuuQGYAbAEooEEOgCyugJpQA0iicA5MDCjuAqkiQAGm4oKEUAYwALcjoAcxooATgkKAMUXmd5KJj4qAA+AF4oAAYAOmKoOHdgKGy4hIAeIoBGcvNucx5uAAc6cliAW3IoSnJSdhoAfQAPAEsAOwAzAHs5FSlmNnZOoA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwIpLtNnQgsQ4AGXIAN3JEAF4auDl0IjpyAApzbt6B4dHzAEosuSIZGQBhCskVEvmAbyzoCGX0jgBJGQhq-zkZdAA1IjF9zC-5gEYADQQYIANg2gMu0GAwBg2Skc2yRBmGA4anIUKgJF+YkYDGeRle6AAIgj6PNMVcIDCALIiZBqdDYYrsOBcSRpYhhaQkJnFDBICDosQoTRmPLYcjcdDxag5CD7AASAFF9gBpCAdUpiIjYaW4SlXUCG6DzbhEFTkYEyDYQMYAPggFypLqp2DQ80e9omAAYIAAyf3ZCAAHgm-1tztd0auBXQkjEvBkbhjroAvhBRpyo6no1gUhBuORkhBlWIJGJ5gADAAkZ3NlozKg5XQYNHI6GS5ClEAAXulBURZMgi1WNinc1c0yaoNPJ61KRCsmmtlc5Gl0A95kU4McSnbHTu97g5Dc+g9x4pylNSAZbAV5kRcBxuCQINvikXeczuLaHU6shhIRSAYVkkRmNhORIVl8D1OUGEwdIMSuIhkl1LpkRWQYRimOD0nQGBZAAMQ7bEKWjDovz5bhIWjHMYzPe5HmqJYSAAJn+DjyAAFniUFgnIIh4m44IAE4AA54nEgB2f4fT40E2NBGhuNElAiGCf5xPMWjc2xL48SeCAfTkTTuP+ABWUSlIs3SXTnaBLxXNwgA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgIwIYBd8BTAJwE8wiA3IgGwG4g)

-----

#### `NaN`, `Infinity`, `-Infinity`

This library will let you use `NaN`, `Infinity` and `-Infinity` literals.

However, note that not all databases will treat these values the same.

| Value       | MySQL         | PostgreSQL                               | SQLite      |
|-------------|---------------|------------------------------------------|-------------|
| `NaN`       | Uses `null`   | `CAST('NaN' AS DOUBLE PRECISION)`        | Uses `null` |
| `Infinity`  | Not supported | `CAST('Infinity' AS DOUBLE PRECISION)`   | `1e999`     |
| `-Infinity` | Not supported | `CAST('-Infinity' AS  DOUBLE PRECISION)` | `-1e999`    |

While you may be able to build queries using these values with the unified library,
they may throw run-time errors when executed.

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUAzgIYCWAnuQHYDcAUAMIgpwxrzJoU30oACiYBIOuQC2AUygA1OCBYAJRUIDMANgCUUCCHQBZRQE0oAaRRmAcmBhRrAVSRIANEyhRRABwD2Ad2kAJyRpADdpABsodjgkJm1mJm8g8gBzSXIoABdyACNI6QB9AA9KOgAzXyF+WjpEoA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwIpLtXCJsDiJeAF4auDl0IjpyAApzbt7+8wBKLLkiGRkAYQrJFRLJgG8s6AhuIhUGav85GXQANSIxdcx7yYBGABoIYIA2BbfD6GAwBg2SkE2yRDGGA4anI-ygGmS6QAMuQAG7kKrDK7oAAioPok1+WQAvksjnI0ugAJIySZFODbEoQAYAPgg9MZuDkJzOCzcYHKI1IBlsBUmRFwHG4JAgdOK3Fy6GwxQWzLZByOgKEpAY7EQMgh4wlhT1+GwJWwOQgmHSsKORGSPS6PT63Dk5rSWhgsgAYuR0CRMJM4ez5Yrldw-kcjhro3GeecLABRMQAa3N5ijcejCORaIxEGqAE4AAwll5yd4h4lZPlZB1Ovwu-rukrpdDemR+gNBkMdBUkJXFLNx2PZ6AJwsWdbjNiZkNHXNiFHozFU7goc2BDgj6M1o51+2OwJNuZuj3tzvdwPB8f98PDkNj8fHU6J8wzyRibDzl-QJcrgW1TxOum7cNuu5HPu0CHtA6BiFwz5Ho2syuq2nodr6-o3gu0D3oOEaQdmSF-q+ZxTh+kgkNsv6kYuSCIsu+aYgAckQLFEXG0FxrBUDEuyEKBrK6RiKqJFQICAAq-AQAAys23AAOT4EuED0KuAlKdo+a8DQDAFGoBRpNwQQyBANBcLJACKSJxH2xS4BU5ByCJmjTJskhwGZ3BINoF7eKh8wfCJvEQDWpJuEAA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgZwIYEsBPXAOwG4g)

-----

### `@squill/IDecimal`

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

The `decimalLiteral(rawDecimalLiteral, precision, scale)` function may be used
to convert `string|number|bigint|Decimal` values into an expression of SQL type `DECIMAL`.

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUAtgJ4wCGARgDYCmA3AFADCIKcMa8yaFavQZQAFCyhQAkAFoZUAOoiAzgAsA9gFc6AEyhUAbuoCWezcuMA7AOZQALqpHAUbdAFk4SKDqp2q98gAHBglpOSgAd2MHKAIARSRokRoGAGMqcxF4xLsRKLo6KAArczsoTNDZeU5PKCtlXKodABp9Sz0HY2VI4wKoACdNK3tHSvDA-rSu43VLSLyqSzsAOjH5AnVWiJFM2DwYVakDPdwYKAgQdzgQAE0oAGkUO4A5MDPngFUkJBYASlYWBMqNZSP4-MIAPoADysADN1KJBLRGP8WCwCChUGwziwpGw4ERRAByACMACYAMxEqAEqDOVweJCiABsAFZWhSAAy-X7NXHhbJJYqlKDpBrdOzqKA1LyLPR0dTKBjdCZTCyzKCOSa4-GEokU5YkgAsJNZAE4yWyKayABxmgDsZoplJtRuZlqNFIpNud9uptPpVyZbI53P+QA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwIpLtFQ4AFSI6BgBeGrg5dH76AApzbr6B8wBKLLkiGRkAYQrJFRLJgG8s6AgANwhq-zkZdAARXNV2SYA2AFYAGghggAYF16yAXyWRzkaXQAjE9zEHAA0uQOJMinBtiUIIMAHwQADaCKRuDkxwAugs3GByqNSAZbAVJkRcBxuCQIPDitxcuhsMUFij0QcjsBgEJSAx2IgZERxmw0hASML8NgStgchBMOlyFkOqUICkUcRkkRAhBZhNyHI5WktDBZAAxcjoEiYSaHaAdFkkNnFX5HI48z0+07nIyXO4qdgAGTiYgejp9vOAPX4BHwKk0DDUBRIeHZvCwRCzyqj0agfJkUgG2TFRAwHDUhRzEFTSGOCtVBYL5nqAEYACzt54ATgATC9gs8ABy9gDsveC-eCI87j0HneCs+n4-MHpbPpeG83Ry++aOgOjfyyRLVxVwFWNLEYkxSZ4BbiAA#post-ts/MoUQMiDCAqAEBuAaWAXAngBwKYHsBmAFPAJSwBiASgPICysAtmtAIYBGANlgNxA)

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

Although SQLite does not natively support `DECIMAL` types, the SQLite library should [polyfill](https://github.com/AnyhowStep/tsql/issues/28) it.

This library imposes the following constraints on `DECIMAL` types, in its attempt to unify behaviour,
+ Precision : [1, 65]
+ Scale : [0, min(30, precision)]

Database-specific libraries may impose a different precision/scale constraint.

Alternatively, you may use a custom data type to implement a `DECIMAL` data type with higher precision/scale.

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/Q#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwdDEuAG8s-zkcklV2ABk4sXYACizoCGBgABV+AnwVTQY1AsHqYr4iXixyaeg5mSk6BhkidCIMDjVCvYgNpAA3bByjqHN6gEYAFh+AFYAJwAJgAbIDgoCABzAgDswOCoOCML+4Ihf2CqOR8PMABpPrNgAB1HD0CDg8HLYgQF7sd4QRqlcTkADKAEVhk9NnhsMVCTMZnMAJLaQjYbj0gIyHgQACyHE5wwUQuOwDZSHxfAY0mwKGw5FlASSRE6EGSTggBQAVrltFg8Kq1ZTwYKXcEAAxZACUbgAvhASFcSJgIBN0mIfRAejMiiUKuQ5JHNBGxFGA4oOt1ekZ+rkhnBRkFxnApi7iYsJSs1jyC9t9phHgciSczhTLtdbvcg49nm8PhXvnJ-kCwZDoXDEcjUejMdiYbiCUTIe61XMyXYGMEfjSbtLGcz0KzlX5g-Q10LReL8JKD7LJQqlVzneuNVqdRA9QajRATeNzUtBBrXIO0SAdfhXyFHdfQDXt0FDcNI2jWNoHjXBE2TdNU2QzN2nNVCoD6AZC2LdJJiJcxPWXCsN3JBhPT3OkGVlRVTw2et+W4S9hWAMUaTvFi5SPE8X1bd9tQOL9uH1Q1jVoACuCAxBbXtPgnSJT0eOgb0Zj9MBA2DBCwzTKMYyydDMJTMRTP0-0swI3M4HzQYVBGMYKKHajtKgUEfOJNlzwebhuCQbQaAYHBGEwdJdl4Diti4olglggz4MQ2zzLjYoMPoLCJBs3CDLAIA#post-ts/Q)

-----

All `DECIMAL` types **SHOULD** have a Typescript type of the `Decimal` interface.

If this convention is not followed, this library makes no guarantees regarding the consistency of query results.

-----

| `@squill/squill`      | MySQL              | PostgreSQL         | SQLite
|-----------------------|--------------------|--------------------|-----------
| `dtDecimal()`         | `DECIMAL(p, s)`    | `DECIMAL(p, s)`    | Unsupported; [requires polyfill](https://github.com/AnyhowStep/tsql/issues/28)

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUAtgJ4wCGARgDYCmA3AFADCIKcMa8yaFavQZQAFCyhQAkAFoZUAOoiAzgAsA9gFc6AEyhUAbuoCWezcuMA7AOZQALqpHAUbdAFk4SKDqp2q98gAHBglpOSgAd2MHKAIARSRokRoGAGMqcxF4xLsRKLo6KAArczsoTNDZeU5PKCtlXKodABp9Sz0HY2VI4wKoACdNK3tHSvDA-rSu43VLSLyqSzsAOjH5AnVWiJFM2DwYVakDPdwYKAgQdzgQAE0oAGkUO4A5MDPngFUkJBYASlYWBMqNZSP4-MIAPoADysADN1KJBLRGP8WCwCChUGwziwpGw4ERRAByACMACYAMxEqAEqDOVweJCiABsAFZWhSAAy-X7NXHhbJJYqlKDpBrdOzqKA1LyLPR0dTKBjdCZTCyzKCOSa4-GEokU5YkgAsJNZAE4yWyKayABxmgDsZoplJtRuZlqNFIpNud9uptPpVyZbI53P+QA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwIpLtFQ4AFSI6BgBeGrg5dH76AApzbr6B8wBKLLkiGRkAYQrJFRLJgG8s6AgANwhq-zkZdAARXNV2SYA2AFYAGghggAYF16yAXyWRzkaXQAjE9zEHAA0uQOJMinBtiUIIMAHwQADaCKRuDkxwAugs3GByqNSAZbAVJkRcBxuCQIPDitxcuhsMUFij0QcjsBgEJSAx2IgZERxmw0hASML8NgStgchBMOlyFkOqUICkUcRkkRAhBZhNyHI5WktDBZAAxcjoEiYSaHaAdFkkNnFX5HI48z0+07nIyXO4qdgAGTiYgejp9vOAPX4BHwKk0DDUBRIeHZvCwRCzyqj0agfJkUgG2TFRAwHDUhRzEFTSGOCtVBYL5nqAEYACzt54ATgATC9gs8ABy9gDsveC-eCI87j0HneCs+n4-MHpbPpeG83Ry++aOgOjfyyRLVxVwFWNLEYkxSZ4BbiAA#post-ts/MoUQMiDCAqAEBuAaWAXAngBwKYHsBmAFPAJSwBiASgPICysAtmtAIYBGANlgNxA)

-----

### `boolean`

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

| `@squill/squill`      | MySQL        | PostgreSQL   | SQLite
|-----------------------|--------------|--------------|-----------
| `dtBoolean()`         | `TINYINT`    | `boolean`    | `INTEGER`

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUANgJYDmAFgC4BGArqfQNwBQAwiCnDGvGRoKNBs3pQAFOyhQAkCLpMW6ACYYAcvwDiKEFAgh0AWTggAmlADSKS3ACqMMOg3cUxlFqgawMb-aQkABp2OQBnAHdyWgBjagBTVTAAOygEMDBUOA1vX39A9gBKDnYABwAnAENKAFtKqFpK+lJ4gH0AD3JkgDMAe0lFMRZi9nYCFFROP1CAWhmoel7elsrksKguqAIARSRo+KhK8oPjytJSAE8oACtGMNoN5Np4ynjysNCYEHsUELlMOBIcZ-WgXUrxXrdSRfH6FEFgiFQgFAlDFIA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwIpLtAMZMdBpJOBoIAF4auDl0IjpyAApzbt7+wfMASiy5IhkZAGEKyRUSmYBvLOgIBb6BmgBJGQhq-zkZdAAhbEZr7nQAZXfuchkMxWABpTtBcMlAiRMACAPK8B5GJ6vJr0IjcIGgs4AXzWZzkaXQMEk6CQnxIBRU5C+MyKcH2JRGAD4IHSGbg5BcljcZCs3GByuNSAZbAUZkRcBxuCQILTiv8SOhsMUVsyICczsBgEJSAx2IgZERJmw0qz9fhsCVsDkIDCClkOqU-JD0NC4dwXlcRsRkkRAud3osrnJLWktDBZAAxciuzAzMFQDoKpXFLFnaAa9NZiFQmEyeH3DBiSTkNNZ7FZPlZLUAdScEDUYkt2gABuhi+QW8CIGIjXa+OiIC2AIwthSa4At54vVHkdFAlus4oAN3S6At2lJxAgAClvhAaLP0ePoI6KuROUhGDMc7H3Z7BlWHcUnbe3fmUCgH0NRkRff6uWDUM1wjGRo1jeMs0TeVchTbgy3TTMoPBF13wLaoUHYNIEJxSs3AnOsEAbJsviHTC4DSLsez7dIB14FsAAYx2rSdpyPDEVkXDpVy0DcMCQbc9wPdiT2gkpz0va83zzWFP2-KtcTcIA#post-ts/MoUQMiDCAqAEBUAaWAXAngBwKYHsBmAFAM4DuAligMYAWWAJgPIB2AlLAGIBKDAsrADZkA5tRQAjAK78xAbiA)

-----

### JS `Date`

Although MySQL and PostgreSQL support `DATETIME` types with microsecond precision,
this library only really supports up to millisecond precision because JavaScript's
`Date` type only has up to millisecond precision.

SQLite also only has up to millisecond precision.

-----

Attempting to use microseconds with this library will cause a loss in precision.

You may use a custom data type to implement a `DATETIME` data type with higher precision.

-----

You should avoid using the `TIMESTAMP` type with MySQL because
it has a range of `'1970-01-01 00:00:01' UTC` to `'2038-01-19 03:14:07' UTC`.

See [The Y2038 problem](https://github.com/AnyhowStep/tsql/issues/131) for more details.

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

| `@squill/squill`      | MySQL         | PostgreSQL     | SQLite    | Precision
|-----------------------|---------------|----------------|-----------|-----------
| `dtDateTime(0)`       | `DATETIME(0)` | `TIMESTAMP(0)` | Unsupported. `strftime()` can create `TEXT` representations. | second (1s)
| `dtDateTime(1)`       | `DATETIME(1)` | `TIMESTAMP(1)` | Unsupported. `strftime()` can create `TEXT` representations. | decisecond (0.1s)
| `dtDateTime(2)`       | `DATETIME(2)` | `TIMESTAMP(2)` | Unsupported. `strftime()` can create `TEXT` representations. | centisecond (0.01s)
| `dtDateTime(3)`       | `DATETIME(3)` | `TIMESTAMP(3)` | Unsupported. `strftime()` can create `TEXT` representations. | millisecond (0.001s)

Using `dtDateTime(3)` is recommended, as much as possible, for maximum interop with JS `Date`.

-----

Note that these data types will throw an error if they encounter a value with a higher precision than expected.

For example, `dtDateTime(0)` will throw if it encounters `2010-02-11 14:32:46.123`
because it is expecting the fractional part to be `.000` (precision 0) and we have `.123` (precision 3)

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUANgPYDmA3AFADCIKcMa8yaFlUAFLVFACQAEwCmAZwDGAJwCWABwAus8gDsoANTgh6ACW08ATAAYALAA4AlFAgh0AWW0BNKAGkULgHJgYUTwFUkJAAaWkFJCkkAa2MoYBYUGAcUHmNrb18AoNDwyKiARjiEpPsU-PSfP0CQsIjyaMMi1hKUwwrM6py66IBmJsTknh72qqDaSzpaeWkAQ0oAWxmoRRmAI1JRAH0AD1lVADNyHi4J2loCFFR6XzCAWlv+lqhJGfVV0ShReYBXUhnFUTCKAAd1kigAFlBxIppPtlPNRDxLGFobD4YiAOQAUictyx8zxQKxugAXFj7GT9hjglAMapyMCMRMgA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwIpLtFkYIAF4auDl0IjpyAApzbvMASiy5IhkZAGEKyRUSsYBvLOhsyhIxbDV0bGKIav85GXQANSIxJcx7sYBGABoIACYABgAWAA5pm8dtA8kgSABrb7nAZXdAAESIQQAKqpxt8gSCoGDIS8YZdroiUWjXpjdrscRDPvijHCieRUSpxp8yeTsSxIaELrTCUiGSTgqyoABfWa7ORpdACQ4qe4cADS5A4YyKcDWJT6AD4IABtVXq3BXfaHY6nbgAXWmbjAKGkJBOZ3QSHpjPI0LGACtcPSYfTpr6+RBtrsCuhJGJeNxyMkIPSxgBZJGYOQoFiaT3evlyRjkdCusb+4AQF7fUv+3QlstuYWKW3ce1mjDOvmuvEZn3VP0BoJBrKh8OR6OxvkJpMptNidtZnN5kmF4tlnyVq1gGs2u0O3hOl1o6lTnudvn+w894PQfsRiBRmNxxNYcdNSde+nZ3P5+cl8sLldr8qDUgGLYBRjEQuAcPWEAqsUUYNsU-q9NqZ5QMAwBCKQDDsIgMhIiMoGFJh+DYCU2A5BAmDpOQWQdKUEDJEgELkAAqmoMDaP017DkEBZuBSxQ0XRDHMX0xDJEQgQQN0chEWkWgwLIABiuYkJgYxYhAHQwZuwJslASE6VAOS4AcRybjC5gAOr0QwkhqOY2n6aCHJQjC24tmi3xjAJTEsegQoOZSeLVK5xJMi8nlWcxrF+fplLUkFzYheQnzhYJPnRTplJcrREU+fZbI1rsK68SUFTkHI3Qpd5K5UXx2hIGo5BRjIAAy5AoOgACiHDkAEMiscJHFxkVoK1cgDVNa17VdT1JHCUQoniZJ0npOgckyIp6DKapMXQbkWlqXp+mGcZppnNU5gAPLjeQMgQJN2jTb1dlqRSTnQvFO5Mh59WNTd92PSRUV5f5TmBU2n3kGFP0TW1nXdb1QMvY54JUi5CX8kyyXQ39sMA31vnAzFTlZdjLW4-DgPoIT0AFdAw3YnxpXlUgjBjKT-0UzI1XFTRpMAErYIwmBwzN+MDUOQ08SNnRjb9MgC0LIu9XNC1dCzUklCta0bVtakaXtZrU7pSMGcaJmNudV1yxACvCxAePPQ5yOQu94NuV9bPXfLgvC3jiNO+yKNg8FGOQ57cu20rlPpWysVoxDWNe5HfsEyb6nEzC-M+1H+NGxAtNQPT6mM-QzOs1nit49z0s0UEpREYwADKRjNbQYhyirYlq4wGsyatClKSpeu7bB3B54dOnHSapnncilAnNwPSNwAis1d1t3KjsB5SruXCQ4YFNws5MqURDqB5MfkgFNKDPvYiH8f89n2oYWX69KNxbCd8P66p-qMlb9nYQiynvA+jVH5-zUMEAsecC4QCLtRJmFU64Lybi3DeYgODVVXCuIAA#post-ts/MoUQMiDCAqBQCQAqANAgLgTwA4FMD2AZgBQDGANniQNYAMAlKvJroaRdQIwPrb7HmUqAJm5NerAdQDMdWADEASgHkAsggoBzWEoUAREAoAEAIQCaCSVSmGAgsEgBuIA)
