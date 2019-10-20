### `.map()`

This is not a SQL concept.

Rather, this is similar to `Array.prototype.map()`.

-----

### Motivation

As your applications get more complex, you may start to write code that looks like this,
```ts
import * as tsql from "@tsql/tsql";

async function fetchComplexThing (connection : tsql.IConnection) {
    const arr = await /*myQuery*/
        .fetchAll(connection);
    const result : ComplexObj[] = [];
    for (const row of arr) {
        /**
         * Perform some complicated mapping on each row
         */
        result.push({
            ...row,
            complicatedProperty0 : await /*myOtherQuery0*/
                .fetchAll(connection),
            complicatedProperty1 : await /*myOtherQuery1*/
                .fetchOneOrUndefined(connection),
            /* snip more complicated stuff */
        });
    }
    return result;
}
```

-----

While the above snippet works fine, we can (hopefully?) do better.
```ts
import * as tsql from "@tsql/tsql";

function complexThingQuery () {
    return /*myQuery*/
        .map(async (row, connection) => {
            /**
             * Perform some complicated mapping on each row
             */
            return {
                ...row,
                complicatedProperty0 : await /*myOtherQuery0*/
                    .fetchAll(connection),
                complicatedProperty1 : await /*myOtherQuery1*/
                    .fetchOneOrUndefined(connection),
                /* snip more complicated stuff */
            };
        });
}

/* elsewhere */
const result = await complexThingQuery()
    .fetchAll(connection);
```

-----

### Chaining `.map()`

You may call `.map()` multiple times, to build up more complex mapping code,
```ts
complexThingQuery()
    /**
     * This is the second time we are calling `.map()`.
     * The callback does not need to be `async`.
     */
    .map((row) => {
        return {
            ...row,
            /**
             * The `row` argument is the result of the previous `.map()`
             */
            sum : row.complicatedProperty0.length + (row.complicatedProperty1 == undefined ? 0 : 1),
        };
    })
    /**
     * This is the third time we are calling `.map()`.
     */
    .map((row) => {
        return {
            ...row,
            /**
             * The `row` argument is the result of the previous `.map()`
             */
            sum2x : row.sum * 2,
        };
    })
    .fetchAll(connection);
```

-----

### Building more complex queries

Being able to chain `.map()` isn't much use yet, in general.
Instead of using **three** `.map()` calls, the above example could have the same result with just **one** call to `.map()`.

The real benefit comes from allowing more complex queries to be built.
Particularly, being able to add more aliases to the `SELECT` clause.


```ts
complexThingQuery()
    .innerJoinUsingPrimaryKey(
        tables => tables.myTable,
        otherTable
    )
    .select(columns => [
        columns.otherTable.otherColumn,
    ])
    /**
     * The `originalRow` argument will always be an "unmapped" row.
     *
     * The first call to `.map()` in `complexThingQuery()` will not return `otherTable.otherColumn`.
     * So, `row` will not have `otherTable.otherColumn`.
     *
     * However, `originalRow` will have `otherTable.otherColumn`.
     */
    .map((row, _connection, originalRow) => {
        return {
            ...row,
            otherColumn : originalRow.otherTable.otherColumn,
        };
    })
    .fetchAll(connection);
```
