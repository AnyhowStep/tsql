### `.addColumns()`

We use the `.addColumns()` method to add columns to the table.

```ts
import * as sql from "@squill/squill";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : sql.dtBigIntSigned(),
        title : sql.dtVarChar(255),
        createdAt : sql.dtDateTime(3),
    });
```

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUAtgJ4wCGARgDYCmA3AFADCIKcMa8yaFavQZQAFCyhQAkINqN0AEwwA5HgHEUIKBBDoAsnBABNKAGkUJuAFUYYdMo4o9KVVGVgYbq0iQAaCdIALgCWgYxQAGqGbAAShqIATACsSQCUbh5ePv6SUgDGAE4MVIEMCnCBUMDcKDD6KKIAzOnunsreSFUomNZInqIAzoEFAGYhpAyiAOQApEYAtDOki0ozMQBcM3qbI1O+UFMAdgD2AO5TqaksqawsAA4FVADmpFRQgXIMAPoAHsGHI2OolkwhuLBY9gImk89lsUBYMkonzEITCDHSLCiSCsKBICOmMQYdDox32p2OBToCguTCAA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGBFIpLtFQ4AFSI6BgBeGrg5dH76AApzbr6B8wBKLLkiGRkAYQrJFRLJgG8s6AhZifIASRkIav85GXQAIWxGM+50AGUn7nIZSYWAGkO0HQgXoVxGt3QADUiGJ1pgYZMAEwAVmR-0BUBIBSIQRkMG01yMEIAIjjyD1VORJsF0UcAL4LNxHMDlUakAy2AqTIi4DjcEgQSYdL4kYHFBYQQYAPggByOwGAQlIDHYiBkOP6PMKqvw2BK2ByEEw6XIWQ6pQgKUlxGSREC4PCKkmJwGSyORzkaXooqFWx2+GlEAA2kU4NsSgBdN3uqByFDkdAkTDwOC+7gisXcRlm4q4CrkOQsRiTFLZhluIA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgWwJ7QEMAjAGwFMBuIA)

-----

We need to specify the column alias, and data type of each column.

For more information about the data types used in the code sample,
see [Default supported data types](../data-type/default-supported-data-types.md)

-----

Now that the table has a few columns, we can now start writing queries with it.

However, this table definition is far from being useful. We can add more to the table definition.

For example, [declaring the primary key](declaring-the-primary-key.md) of the table.
