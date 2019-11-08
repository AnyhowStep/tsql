### Schema Validation

Schema validation is performed by invoking `SchemaValidationUtil.validateSchema(applicationTables, schemaMeta)`

-----

### Application Schema

Tables created using `tsql.table()` are part of the application schema.

See [Defining Tables](/doc/00-getting-started/00-defining-tables.md) for more information.

-----

### Database Schema

Tables created using Data Definition Language (DDL) like `CREATE TABLE ...` are part of the database schema.

-----

### Why Schema Validation?

It is possible for the application and database schema to go out of sync.

For example, you may create an application table named `"fooTable"`
but the table is actually named `"barTable"` on the database,
and `"fooTable"` does not exist!

Attempts to use `"fooTable"` will result in run-time errors.

-----

### Usage

```ts
import * as tsql from "@tsql/tsql";

//Assume we already have this
declare const pool : tsql.IPool;

//SchemaMeta|undefined
const schemaMeta = await pool.acquire(
    /**
     * When `undefined` is used as the argument for `schemaAlias`,
     * the connection's current schema is used.
     */
    connection => connection.tryFetchSchemaMeta(undefined)
);
if (schemaMeta != undefined) {
    //Do stuff like schema validation (or code generation in the future)
    const validationResult = tsql.SchemaValidationUtil.validateSchema(
        [
            myTable0,
            myTable1,
            myTable2,
            //snip etc.
            //You should pass in all tables of the schema you're trying to check.
        ],
        schemaMeta
    );
    /**
     * Warnings are not *too* bad.
     * They should be addressed but shouldn't cause run-time errors, if ignored.
     */
    console.warn(validationResult.warnings);
    /**
     * Errors are **BAD**.
     * You **MUST** fix them!
     *
     * The schema on the application and the database differ enough that
     * continuing will cause run-time errors.
     */
    console.error(validationResult.errors);
}
```

`SchemaValidationUtil.validateSchema()` returns a [`SchemaValidationResult`](/src/schema-validation/schema-validation-result.ts#L9)

-----

### Warnings

An `enum` of all possible warnings may be found [here](/src/schema-validation/schema-validation-warning.ts)

Warnings indicate possible database design problems (like not having a `PRIMARY KEY`),
or schema sync issues that will not cause run-time errors.

TODO Justify why I think these are warnings

-----

### Errors

An `enum` of all possible errors may be found [here](/src/schema-validation/schema-validation-error.ts)

Errors indicate schema sync issues that will cause run-time errors.

These should be fixed before using the library.

TODO Justify why I think these are errors
