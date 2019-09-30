### `WHERE` Clause

The `WHERE` clause lets you specify a condition rows must satisfy to be part of the result set.

-----

### 2-valued Logic vs 3-valued Logic

MySQL, PostgreSQL and SQLite allow conditions that evaluate to `NULL`.
The databases support 3-valued logic.

+ If a condition is `TRUE` for a row, it is included in the result set.
+ If a condition is `FALSE` or `NULL` for a row, it is **excluded** from the result set.

-----

This library is **highly opinionated** and **will not** allow 3-valued logic for the `WHERE` clause.

You should use `COALESCE()`/`IS TRUE`/`IS FALSE`/`IS UNKNOWN` to convert any `NULL` values
to `TRUE`/`FALSE`.

In general, allowing `NULL` values in the `WHERE` clause indicates sloppy logic.

-----

By forcing the `WHERE` clause to only allow 2-valued logic,
we make our queries safer by explicitly deciding how to handle potentially ambiguous cases.

-----

For example,
```sql
SELECT
    *
FROM
    person
WHERE
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
    )
```

The above query attempts to `SELECT` all `person`s that have `consented` to organ donation.

However, it is possible for the subquery in the `WHERE` clause to evaluate to `NULL`.
Particularly if the `person` has no matching rows in `organDonationConsent`.

-----

When the subquery evaluates to `NULL`, has the `person` consented to organ donation or not?

In some countries, the lack of explicit consent/refusal implies **consent**.
In others, it implies **refusal**.

If all `person`s lacking explicit consent/refusal are assumed to have `consented`,
then the above query will return fewer rows than expected!

If **consent** is implied, we should rewrite the query,
```sql
SELECT
    *
FROM
    person
WHERE
    -- If the `person` has no record of being consenting/refusing,
    -- we assume the `person` has `consented`
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
```

-----

### TODO More documentation
