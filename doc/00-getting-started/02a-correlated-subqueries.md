### Correlated Subqueries

Correlated subqueries are queries that use columns from outer queries.

A query that does not use columns from outer queries is also called a non-correlated query.

-----

The simplest way to create a correlated subquery is,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `outerTable` elsewhere
 */
import {outerTable} from "./table";

const myCorrelatedQuery = tsql.requireOuterQueryJoins(outerTable);
```

This correlated subquery is empty at the moment and has no `FROM` clause.

-----

Correlated subqueries are useful for composing expressions.
```ts
import * as tsql from "@tsql/tsql";
import * as tm from "type-mapping/fluent";

const person = tsql.table("person")
    .addColumns({
        personId : tm.mysql.bigIntSigned(),
        firstName : tm.mysql.varChar(2048),
    })
    .setAutoIncrement(columns => columns.personId);

const organDonationConsent = tsql.table("organDonationConsent")
    .addColumns({
        personId : tm.mysql.bigIntSigned(),
        consented : tm.mysql.boolean(),
        occurredAt : tm.mysql.dateTime(3),
    })
    .setPrimaryKey(columns => [columns.personId, columns.occurredAt]);

/*
    This is a correlated subquery because it uses columns from outer queries.

    It fetches the latest change in consent of a given person.

    In SQL,

    (
        SELECT
            organDonationConsent.consented
        FROM
            organDonationConsent
        WHERE
            -- This references `person.personId`, a column from the outer query.
            person.personId = organDonationConsent.personId
        ORDER BY
            organDonationConsent.occurredAt DESC
        LIMIT
            1
    )
*/
const consentedToOrganDonation = tsql
    .requireOuterQueryJoins(person)
    .from(organDonationConsent)
    .whereEqOuterQueryPrimaryKey(
        src => src.person,
        dst => dst.organDonationConsent
    )
    .orderBy(columns => [
        columns.organDonationConsent.occurredAt.desc()
    ])
    .limit(1)
    .select(columns => [columns.organDonationConsent.consented]);

/*
    This is a non-correlated query that fetches all persons who have consented to organ donation.

    If they have not stated their consent/refusal, we assume they consent.

    In SQL,

    SELECT
        *
    FROM
        person
    WHERE
        COALESCE(
            (
                SELECT
                    organDonationConsent.consented
                FROM
                    organDonationConsent
                WHERE
                    person.personId = organDonationConsent.personId
                ORDER BY
                    organDonationConsent.occurredAt DESC
                LIMIT
                    1
            ),
            TRUE
        )
*/
const personsConsentedToOrganDonation = tsql
    .from(person)
    .where(() => tsql.coalesce(consentedToOrganDonation, true))
    .select(columns => [columns]);
```

The `personsConsentedToOrganDonation` query should, hopefully, be readable,
thanks to the composability of expressions in this library.

-----

### Correlated Subquery Overview

The following methods make a query a correlated subquery,
+ `.requireOuterQueryJoins(...outerQueryTables)`
+ `.requireNullableOuterQueryJoins(...outerQueryTables)`

-----

### `.requireOuterQueryJoins()`

To make a correlated subquery require **non-nullable** joins,
```ts
import * as tsql from "@tsql/tsql";

//We can require just one outer query table
const myCorrelatedQuery1 = tsql.requireOuterQueryJoins(outerTable1);
//We can also require two outer query tables
const myCorrelatedQuery2 = tsql.requireOuterQueryJoins(outerTable1, outerTable2);
//We can also require three outer query tables
const myCorrelatedQuery3 = tsql.requireOuterQueryJoins(outerTable1, outerTable2, outerTable3);
//etc.
//We can require an arbitrary number of outer query tables
```

For a given **non-nullable** join,
+ Non-nullable columns in the table **will not** have `NULL` values.
+ Nullable columns in the table may have `NULL` values.

-----

### `.requireNullableOuterQueryJoins()`

To make a correlated subquery require **nullable** joins,
```ts
import * as tsql from "@tsql/tsql";

//We can require just one outer query table
const myCorrelatedQuery1 = tsql.requireNullableOuterQueryJoins(outerTable1);
//We can also require two outer query tables
const myCorrelatedQuery2 = tsql.requireNullableOuterQueryJoins(outerTable1, outerTable2);
//We can also require three outer query tables
const myCorrelatedQuery3 = tsql.requireNullableOuterQueryJoins(outerTable1, outerTable2, outerTable3);
//etc.
//We can require an arbitrary number of outer query tables
```

For a given **nullable** join,
+ Non-nullable columns in the table **may** have `NULL` values.
+ Nullable columns in the table may have `NULL` values.
