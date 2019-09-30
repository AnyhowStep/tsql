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

For example,
```sql
SELECT
    *
FROM
    device
WHERE
    (
        SELECT
            deviceEnabled.isEnabled
        FROM
            deviceEnabled
        WHERE
            device.deviceId = deviceEnabled.deviceId
        ORDER BY
            deviceEnabled.toggledAt DESC
        LIMIT
            1
    )
```

The above query attempts to `SELECT` all devices that are enabled.

However, it is possible for the subquery in the `WHERE` clause to evaluate to `NULL`.
Particularly if the `device` has no matching rows in `deviceEnabled`.

If we do not have a record of the `device` ever being enabled or disabled,
what is the default state of the `device`?

If we want the default state of the device to be `enabled`, then the above query will give us the wrong result!
In this case, we should rewrite the query,
```sql
SELECT
    *
FROM
    device
WHERE
    -- If the device has no record of being enabled or disabled,
    -- we assume the device is enabled
    COALESCE(
        (
            SELECT
                deviceEnabled.isEnabled
            FROM
                deviceEnabled
            WHERE
                device.deviceId = deviceEnabled.deviceId
            ORDER BY
                deviceEnabled.toggledAt DESC
            LIMIT
                1
        ),
        TRUE
    )
```

-----

### TODO More documentation
