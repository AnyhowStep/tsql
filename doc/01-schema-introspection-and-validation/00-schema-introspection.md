### Schema Introspection

Any adapter library that implements [`IConnection`](/src/execution/connection/connection.ts#L261) will also
have to implement the `tryFetchSchemaMeta(schemaAlias : string|undefined)` method.
This method returns `Promise<SchemaMeta|undefined>`.

At the moment, the [`SchemaMeta`](/src/schema-introspection/schema-meta.ts) type
only contains information like,
+ Schema alias
+ Table information
  + Table alias
  + Primary key
  + Candidate keys
  + Column information
    + Column alias
    + Is `AUTO INCREMENT`?
    + Is nullable?
    + Has `DEFAULT` value?
    + Is `GENERATED`?

The `SchemaMeta` type has enough information to perform the most basic
schema validation checks between the application and database.

In the future, it may contain enough information to perform code generation,
allowing the database schema to be created on the application,
reducing the amount of boilerplate a developer may have to write.

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
}

```
