### Defining Tables

Before we build queries and have them checked at compile-time,
we need to tell the library about the tables in our schema.

-----

To define a table,

```ts
import * as tsql from "@tsql/mysql-5.7";

/**
 * `"myTable"` is the alias of the table in our schema.
 */
const myTable = tsql.table("myTable");
```

A `tsql` table is an immutable data structure.

A method that appears to modify properties of the table
actually returns a new table instance, and does not
modify the original table instance.

-----

We have a table now, but a table without columns is not very useful.

-----

### Columns

RDBMS columns are different from `tsql` columns.

A column of this library consists of,

+ `tableAlias`

  The alias of the table that this column belongs to.

+ `columnAlias`

  The alias of the column.

+ `mapper`

  A function that validates/converts values to/from the database.

  A `mapper` must additionally follow some conventions
  outlined [here](https://github.com/anyhowstep/type-mapping#custom-mappers)

  In general, you should not need to write your own mappers
  and can just use the ones in this [library](https://github.com/anyhowstep/type-mapping)

-----

A `mapper` is necessary because your database driver library may fetch
values in a format you may not be expecting.

For example,
+ `BIGINT` values may be fetched as `string`; you may be expecting `bigint`
+ `DATETIME` values may be fetched as `string`; you may be expecting `Date`
+ `BOOLEAN` values may be fetched as `0|1`; you may be expecting `boolean`

The `mapper` will convert the "raw" values from your database to a type you expect.

-----

A `mapper` is also used to validate/convert data coming from your application,
before it is sent to the database as part of a query.

For example,
trying to `UPDATE` a `VARCHAR(255)` column and set its value to a `string` of length `1024`
should cause the `mapper` to throw an error.

The `mapper` should throw an error if your application tries to send invalid data.

-----

A `mapper` may also be used to run arbitrary application-side constraints on column values.

For example,
+ Only allowing prime numbers
+ Only allowing strings that are also palindromes
+ Only allowing strings of length 3 to 255

-----

### Adding columns

We use the `.addColumns()` method to add columns to the table.

```ts
import * as tsql from "@tsql/mysql-5.7";
/**
 * `type-mapping` is a batteries-included data mapping library.
 * It contains data mappers suitable for use with MySQL.
 */
import * as tm from "type-mapping/fluent";

const myTable = tsql.table("myTable")
    .addColumns({
        /**
         * This mapper accepts `string|number|bigint` and
         * outputs a `bigint` greater than or equal to zero.
         */
        myId : tm.mysql.bigIntUnsigned(),
        /**
         * This mapper accepts `string` and
         * ensures the string is of length 255 or less.
         */
        title : tm.mysql.varChar(255),
        /**
         * This mapper accepts `string|Date` and
         * outputs a `Date`.
         */
        createdAt : tm.mysql.dateTime(),
    });
```

Now that the table has a few columns, we can now start writing queries with it.

However, this table definition is far from being useful.
We can add more to the table definition.

-----

### `.addAllMutable()`

By default, all columns added to a table are **immutable**.

This means their values cannot change using `UPDATE` statements
with this library.

However, their values can still be changed *outside* of this library.

-----

To make all non-`GENERATED` columns **mutable**,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const myTable = tsql.table("myTable")
    //These 3 columns are immutable by default
    .addColumns({
        myId : tm.mysql.bigIntUnsigned(),
        title : tm.mysql.varChar(255),
        createdAt : tm.mysql.dateTime(),
    })
    //Now, we may use `UPDATE` statements on these columns
    .addAllMutable();
```

The TS type system should stop you from attempting to update immutable columns
during compile-time.

However, if you **do** manage to circumvent the type system,
the run-time checks in this library should prevent it from happening.

-----

Note that `GENERATED` columns cannot be mutable.

-----

### `.addCandidateKey()`

A candidate key is a minimal set of columns that uniquely identifies a row in a table.

In MySQL, a `UNIQUE KEY` roughly corresponds to the concept of a candidate key.

+ A table may have zero-to-many candidate keys. (recommended to have at least one, the `PRIMARY KEY`)
+ A candidate key cannot be a subset of other candidate keys.
+ A candidate key cannot be a superset of other candidate keys.
+ A candidate key can intersect other candidate keys.
+ A candidate key can be disjoint from other candidate keys.

-----

To add a candidate key,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const creditCardUsage = tsql.table("creditCardUsage")
    .addColumns({
        creditCardUsageId : tm.mysql.bigIntUnsigned(),
        creditCardNumber : tm.mysql.varChar(255),
        /**
         * `DATETIME(3)` gives us millisecond precision.
         * The same precision as a JS `Date`.
         */
        usedAt : tm.mysql.dateTime(3),
        deltaAmount : tm.mysql.bigIntSigned(),
    })
    /**
     * This adds the candidate key `(creditCardNumber, usedAt)`
     * to the table `creditCardUsage`.
     *
     * The idea is that a credit card cannot be used
     * twice within the same millisecond.
     * (This isn't necessarily true but pretend it is true)
     */
    .addCandidateKey(columns => [
        columns.creditCardNumber,
        columns.usedAt,
    ]);
```

-----

Adding a candidate key lets you use methods like,

From `Table`,

+ `.assertExistsByCandidateKey()/.assertExistsByCk()`
+ `.assertExistsBySuperKey()/.assertExistsBySk()`
+ `.existsByCandidateKey()/.existsByCk()`
+ `.existsBySuperKey()/.existsBySk()`

+ `.fetchOneByCandidateKey()/.fetchOneByCk()`
+ `.fetchOneBySuperKey()/.fetchOneBySk()`
+ `.fetchZeroOrOneByCandidateKey()/.fetchZeroOrOneByCk()`
+ `.fetchZeroOrOneBySuperKey()/.fetchZeroOrOneBySk()`

+ `.fetchValueByCandidateKey()/.fetchValueByCk()`
+ `.fetchValueBySuperKey()/.fetchValueBySk()`
+ `.fetchValueOrUndefinedByCandidateKey()/.fetchValueOrUndefinedByCk()`
+ `.fetchValueOrUndefinedBySuperKey()/.fetchValueOrUndefinedBySk()`

+ `.updateOneByCandidateKey()/.updateOneByCk()`
+ `.updateOneBySuperKey()/.updateOneBySk()`
+ `.updateZeroOrOneByCandidateKey()/.updateZeroOrOneByCk()`
+ `.updateZeroOrOneBySuperKey()/.updateZeroOrOneBySk()`

+ `.updateAndFetchOneByCandidateKey()/.updateAndFetchOneByCk()`
+ `.updateAndFetchOneBySuperKey()/.updateAndFetchOneBySk()`
+ `.updateAndFetchZeroOrOneByCandidateKey()/.updateAndFetchZeroOrOneByCk()`
+ `.updateAndFetchZeroOrOneBySuperKey()/.updateAndFetchZeroOrOneBySk()`

+ `.deleteOneByCandidateKey()/.deleteOneByCk()`
+ `.deleteOneBySuperKey()/.deleteOneBySk()`
+ `.deleteZeroOrOneByCandidateKey()/.deleteZeroOrOneByCk()`
+ `.deleteZeroOrOneBySuperKey()/.deleteZeroOrOneBySk()`

From `Query`,

+ `.whereEqCandidateKey()/.whereEqCk()`
+ `.whereEqSuperKey()/.whereEqSk()`
+ etc.

-----

### `.setPrimaryKey()`

A `PRIMARY KEY` is a candidate key that we designate as **the**
candidate key we wish to use in most cases.

A `PRIMARY KEY` must also not have nullable columns.

It is recommended for every table to have a `PRIMARY KEY`.

-----

To set the `PRIMARY KEY`,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const pageOfBook = tsql.table("pageOfBook")
    .addColumns({
        bookId : tm.mysql.bigIntUnsigned(),
        pageNumber : tm.mysql.bigIntUnsigned(),
        content : tm.mysql.longText(),
    })
    /**
     * Setting a `PRIMARY KEY` also adds it as a candidate key.
     */
    .setPrimaryKey(columns => [
        columns.bookId,
        columns.pageNumber,
    ]);
```

-----

Setting a `PRIMARY KEY` lets you use methods like,

From `Table`,

+ All the candidate key/super key methods
+ All the `PRIMARY KEY` versions of the candidate key/super key methods

From `Query`,

+ `.whereEqPrimaryKey()/.whereEqPk()`
+ `.innerJoinPrimaryKey()/.innerJoinPk()`
+ etc.

-----

### `.setId()`

Many `PRIMARY KEY`s contain only one column.

This is a convenience method for calling `.setPrimaryKey()`
and returning only one column,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

/**
 * The idea behind this table is that
 * an upload can only succeed zero-or-one times.
 *
 * If it succeeds, you get a `downloadUrl`
 * and know when it succeeded.
 */
const uploadSuccess = tsql.table("uploadSuccess")
    .addColumns({
        uploadId : tm.mysql.bigIntUnsigned(),
        downloadUrl : tm.mysql.varChar(2048),
        successAt : tm.mysql.dateTime(3),
    })
    /**
     * + Sets `(uploadId)` as the `PRIMARY KEY`
     * + Adds `(uploadId)` as a candidate key
     */
    .setId(columns => columns.uploadId);
```

-----

### `.setAutoIncrement()`

An `AUTO_INCREMENT` column has a unique value generated for it
when a new row is inserted (if no value is explicitly assigned).

-----

To set the `AUTO_INCREMENT` column,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const user = tsql.table("user")
    .addColumns({
        userId : tm.mysql.bigIntUnsigned(),
        emailAddress : tm.mysql.varChar(255),
        banned : tm.mysql.boolean(),
    })
    /**
     * Setting an `AUTO_INCREMENT` column
     * also sets it as the `PRIMARY KEY` by default.
     *
     * You may overwrite it by calling `.setPrimaryKey()` after.
     *
     * -----
     *
     * It also gets added to the set of `GENERATED` columns.
     *
     * Technically, an `AUTO_INCREMENT` column is not a `GENERATED` column.
     * However, in most cases, we can treat it like a `GENERATED` column.
     *
     * You may make it non-`GENERATED` by calling,
     * `.removeGenerated()`
     */
    .setAutoIncrement(columns => columns.userId);
```

-----

### `.addExplicitDefaultValue()`

+ `GENERATED` columns have implicit default values (The `AS` expression)
+ Nullable columns have implicit default values (`NULL`, at the very least)
+ `AUTO_INCREMENT` columns have implicit default values

Columns that have a default value but are not one of the above column types
are called columns with explicit default values.

+ Columns with implicit/explicit default values are optional in `INSERT` statements.
+ `GENERATED` columns cannot be specified in `INSERT` statements.

-----

An example of a column with an explicit default value is,
```sql
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
```

-----

To specify which columns have explicit default values,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const universe = tsql.table("universe")
    .addColumns({
        universeId : tm.mysql.varChar(64),
        //Assume this has `DEFAULT CURRENT_TIMESTAMP`
        createdAt : tm.mysql.dateTime(),
    })
    /**
     * This column is now optional in `INSERT` statements
     */
    .addExplicitDefaultValue(columns => [
        columns.createdAt,
    ]);
```

-----

### `.addGenerated()`

A `GENERATED` column has its value always computed by the database.

+ You cannot specify a `GENERATED` column in `INSERT` statements
+ You cannot specify a `GENERATED` column in `UPDATE` statements
+ `GENERATED` columns have implicit default values

-----

An example of a `GENERATED` column is,
```sql
`totalAmount` BIGINT UNSIGNED GENERATED ALWAYS AS (`baseAmount` + `surchargeAmount`) STORED NOT NULL,
```

-----

To specify which columns are `GENERATED`,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const player = tsql.table("player")
    .addColumns({
        playerId : tm.mysql.bigIntUnsigned(),
        winCount : tm.mysql.bigIntUnsigned(),
        lossCount : tm.mysql.bigIntUnsigned(),
        /**
         * Assume this is `GENERATED ALWAYS AS ((winCount + 0e0) / (lossCount + 0e0))`
         */
        winLossRatio : tm.mysql.double(),
    })
    /**
     * + This column cannot be used in `INSERT` statements
     * + This column cannot be used in `UPDATE` statements
     * + This column has an implicit default value
     */
    .addGenerated(columns => [
        columns.winLossRatio,
    ]);
```

-----

### `.addMutable()`

Makes specific columns mutable,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const plugin = tsql.table("plugin")
    .addColumns({
        pluginId : tm.mysql.bigIntUnsigned(),
        //Min length 1, max length 255
        version : tm.mysql.varChar(1, 255),
        //Min length 1, max length 255
        title : tm.mysql.varChar(1, 255),
        description : tm.mysql.varChar(2048),
        //Assume we only want this to be mutable
        enabled : tm.mysql.boolean(),
    })
    /**
     * Only `enabled` can be modified using `UPDATE`
     * statements through this library.
     */
    .addMutable(columns => [
        columns.enabled,
    ]);
```

-----

### `.disableDelete()`

Prevents rows of this table from being deleted through this library.

Good for look-up tables, or append-only tables.

-----

To disable `DELETE` statements for a table,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const temperatureSensorData = tsql.table("temperatureSensorData")
    .addColumns({
        sensorId : tm.mysql.bigIntUnsigned(),
        loggedAt : tm.mysql.dateTime(3),
        degreesCelsius : tm.mysql.double(),
    })
    /**
     * We do not want to delete sensor data
     */
    .disableDelete();
```

-----

### `.disableInsert()`

Prevents rows from being inserted to this table through this library.

Good for look-up tables.

-----

To disable `INSERT` statements for a table,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const businessType = tsql.table("businessType")
    .addColumns({
        businessTypeId : tm.mysql.bigIntUnsigned(),
        name : tm.mysql.varChar(255),
        description  :tm.mysql.varChar(2048),
    })
    /**
     * We do not want to add new rows to this look-up table
     */
    .disableInsert();
```

-----

### `.removeAllMutable()`

Makes all columns immutable,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const businessType = tsql.table("businessType")
    .addColumns({
        businessTypeId : tm.mysql.bigIntUnsigned(),
        name : tm.mysql.varChar(255),
        description : tm.mysql.varChar(2048),
    })
    .removeAllMutable();
```

-----

### `.removeExplicitDefaultValue()`

Removes columns from the set of columns with explicit default values,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const businessType = tsql.table("businessType")
    .addColumns({
        businessTypeId : tm.mysql.bigIntUnsigned(),
        name : tm.mysql.varChar(255),
        description  :tm.mysql.varChar(2048),
    })
    .addExplicitDefaultValue(columns => [
        columns.name,
        columns.description,
    ])
    /**
     * Now, only `description` has an explicit default value
     */
    .removeExplicitDefaultValue(columns => [
        columns.name,
    ]);
```

-----

### `.removeGenerated()`

Removes columns from the set of `GENERATED` columns.

-----

When `.setAutoIncrement()` is called, it also adds the column
to the set of `GENERATED` columns.

While `AUTO_INCREMENT != GENERATED`,
we can usually pretend it is because,

+ We do not usually specify values for `AUTO_INCREMENT` columns on `INSERT`
+ We do not usually specify values for `AUTO_INCREMENT` columns on `UPDATE`

However, if you do any of the above in your application logic,
you will want to remove it from the set of `GENERATED` columns,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const user = tsql.table("user")
    .addColumns({
        userId : tm.mysql.bigIntUnsigned(),
        emailAddress : tm.mysql.varChar(255),
        banned : tm.mysql.boolean(),
    })
    .setAutoIncrement(columns => columns.userId)
    /**
     * `userId` is now `AUTO_INCREMENT` and we can set its value in
     * `INSERT` statements.
     */
    .removeGenerated(columns => [
        columns.userId,
    ]);
```

-----

### `.removeMutable()`

Makes columns immutable,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const businessType = tsql.table("businessType")
    .addColumns({
        businessTypeId : tm.mysql.bigIntUnsigned(),
        name : tm.mysql.varChar(255),
        description  :tm.mysql.varChar(2048),
    })
    .addMutable(columns => [
        columns.name,
        columns.description,
    ])
    /**
     * Now, only `description` is mutable
     */
    .removeMutable(columns => [
        columns.name,
    ]);
```

-----

### `.setSchemaName()`

In most databases, the fully qualified name of a column is,

```ts
schemaName.tableName.columnName
```

This library only supports compile-time type safety for `tableName.columnName` (at the moment).

-----

Queries generated by this library will normally only output `tableName.columnName`.

The `schemaName` is left implicit. This means the `schemaName` used
should be the one your database connection session is using.

This is usually fine... Unless you need queries that use tables from multiple schemas.

-----

Calling `.setSchemaName()` will make this library output `schemaName.tableName.columnName`.

However, during compile-time, the query builder will still think `schemaA.x` and `schemaB.x`
are the same table.

To use both in the same query, you will need to alias (`.as()`) one of the tables.

-----

To explicitly set the schema name of a table,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

const COLUMNS = tsql.table("COLUMNS")
    .addColumns({
        TABLE_CATALOG : tm.mysql.varChar(512),
        TABLE_SCHEMA : tm.mysql.varChar(64),
        TABLE_NAME : tm.mysql.varChar(64),
        COLUMN_NAME : tm.mysql.varChar(64),
        /* snip other columns of INFORMATION_SCHEMA.COLUMNS */
    })
    .setSchemaName("INFORMATION_SCHEMA");
```

-----

### `.setTableAlias()`

Changes the alias of the table.

Completely different from `.as()`, which aliases a table for a query.

-----

This method is generally used when you have multiple tables with a similar structure,

```ts
import * as tsql from "@tsql/mysql-5.7";
import * as tm from "type-mapping/fluent";

/**
 * Recall that `table` instances are immutable.
 *
 * Subsequent method calls all return a new table instance
 * and leave the old table instance untouched.
 */
const enumBase = tsql.table("enumBase")
    .addColumns({
        title : tm.mysql.varChar(255),
        description : tm.mysql.varChar(2048),
    });

/**
 * Table `musicGenre` has columns,
 * + `musicGenreId`
 * + `title`
 * + `description`
 */
const musicGenre = enumBase
    .setTableAlias("musicGenre")
    .addColumns({
        musicGenreId : tm.mysql.bigIntUnsigned(),
    })
    .setAutoIncrement(c => c.musicGenreId);

/**
 * Table `instrument` has columns,
 * + `instrumentId`
 * + `title`
 * + `description`
 */
const instrument = enumBase
    .setTableAlias("instrument")
    .addColumns({
        instrumentId : tm.mysql.bigIntUnsigned(),
    })
    .setAutoIncrement(c => c.instrumentId);
```
