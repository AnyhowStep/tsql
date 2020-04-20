### `SafeMapper<TypeT>`

Before talking about `IDataType<TypeT>`, we need to talk about `SafeMapper<TypeT>`.

A `SafeMapper<TypeT>` has the following structure,

```ts
interface SafeMapper<TypeT> {
    (name : string, mixed : unknown) : TypeT;
}
```

This library uses `SafeMapper<TypeT>` to deserialize data from SQL to a JS value of `TypeT`.

Internally, it is (roughly) used like so,
```ts
declare const tableAlias : string;
declare const columnAlias : string;
declare const columnDataMapper : SafeMapper<TypeT>;
//Could be anything, really.
//A string, a number, a bigint, a boolean, an object, etc.
declare const dbValue : unknown;

//Is a value of a more predictable type; TypeT
const jsValue : TypeT = columnDataMapper(
    `${tableAlias}.${columnAlias}`,
    dbValue
);
```

-----

If the `SafeMapper<TypeT>` can deserialize the `mixed` data,
we get a value of `TypeT`.

If it cannot deserialize the `mixed` data, it throws an `Error`.

The `name` argument should be part of the `Error` object, to help identify which column had problems with deserialization.

-----

A `SafeMapper<TypeT>` has a bunch of other implicit constraints needed for it to be "well-behaved".

+ Correctness
+ Idempotence
+ Immutability
+ etc.

See https://github.com/AnyhowStep/type-mapping#custom-mappers for more details.

-----

### The `IDataType<TypeT>` interface

All data types in `@squill` must implement the [`IDataType<TypeT>`](src/data-type/data-type.ts) interface.

```ts
import * as tm from "type-mapping";

interface IDataType<TypeT> extends tm.SafeMapper<TypeT> {
    /**
     * Used to serialize a value of `TypeT` to an object this library can
     * build SQL queries with.
     */
    toBuiltInExpr_NonCorrelated (value : TypeT) : BuiltInExpr_NonCorrelated_NonAggregate<TypeT>;

    /**
     * Used to determine if two values of `TypeT` are equal.
     *
     * Null-safe equality means if both arguments are `null`,
     * it returns `true`.
     *
     * If one argument is `null` and the other is not,
     * it returns `false`.
     */
    isNullSafeEqual (a : TypeT, b : TypeT) : boolean;
}
```

The `IDataType<TypeT>` interface is used to serialize and deserialize values between
JS and SQL. And also determine if two JS values are equal.

-----

All the default supported data types implement `IDataType<TypeT>`.

All custom data types should also implement `IDataType<TypeT>`.
