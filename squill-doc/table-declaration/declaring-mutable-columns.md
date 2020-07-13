### Restricting UPDATE statements/Declaring mutable columns

This library makes all columns of a table immutable by default.

This means you cannot modify column values with UPDATE statements.

-----

You need to explicitly declare which columns are mutable.

-----

### `.addAllMutable()`

A convenience method for declaring that every column is mutable.
```ts
import * as sql from "@squill/squill";

const myTable = sql.table("myTable")
    .addColumns({
        myTableId : sql.dtBigIntSigned(),
        title : sql.dtVarChar(255),
        content : sql.dtVarChar(255),
    })
    .setAutoIncrement(columns => columns.myTableId)
    .addAllMutable();
```

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUAtgJ4wCGARgDYCmA3AFADCIKcMa8yaFavQZQAFCyhQAkINqN0AEwwA5HgHEUIKBBDoAsnBABNKAGkUJuAFUYYdMo4o9KVVGVgYbq0iQAaCdIALgCWgYxQAGqGbAAShqIATACsSQCUbh5ePv6SUgDGAPYAdoEMJZHRcSCJKenunsreSCyprCwADgBOVADmpFRQgXIMAPoAHsFFAGYForLCrSws9gSanva2UCwylMNiIWEMvlCFJWWB6SxRSFYoJNuiAOQxDHR0BccA7gWddAqPx0eSB+DFIUGC7QAzgBXUiPVpAA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGBFIpLtFQ4AFSI6BgBeGrg5dH76AApzbr6B8wBKLLkiGRkAYQrJFRLJgG8s6AhZifIASRkIav85GXQAIWxGM+50AGUn7nIZSYWAGkO0HQgXoVxGt3QADUiGJ1pgYZMAEwAVmR-0BUA6QVeYJud2hsPhYiRqPRRwAvksjnI0ugYJJ0EgXiQCipyK9JkU4NsShBBgA+CBcnm4OQnAYXKnQFZreBwACyDNOvzcRzA5VGpAMtgKkyIuA43BIEE5xS+JGBxQWfMFByOwGAQlIDHYiBkRHGbDSQtd+GwJWwOQgmHS5CyRGSRECx16pzk-rSWhgsgAYuR0CRMJMMUKzblLdwAUcjnbi2XgehQdVzPcOOQ-hBkpo4DJzEWy8WseztNWZBVNH5o0Q2eg2znyVkFqroOHI9HxfQc3JkiGCgBRAwCMSqGEcADS5A4+xzRwX50u1Uezw5AEYyR3KUvJGp3UFsx3O3mLdhiu2P5ith2fABQgUt-2LAp0EkMReDA8COwrKtwQ6EgPXfeCMPMABVF8PW+asGxPDDoGFICxhBMNiI7e8qKOLscWuIw5BQtCiKo7DcKCGQCIgNjiNIkpmOKbF0D4j8aOI8lp3AidxLcSk3CAA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgWwJ7QEMAjAGwFMBuIA)

Auto-increment columns are special and require [extra effort](declaring-the-primary-key.md#enableExplicitAutoIncrementValue) to declare as mutable.

-----

### `.addMutable()`

This method lets you specify which columns are mutable.
```ts
import * as sql from "@squill/squill";

const myTable = sql.table("myTable")
    .addColumns({
        myTableId : sql.dtBigIntSigned(),
        title : sql.dtVarChar(255),
        content : sql.dtVarChar(255),
    })
    .setAutoIncrement(columns => columns.myTableId)
    .addMutable(columns => [
        columns.title,
    ]);
```

Mutable columns may be modified with UPDATE statements.

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUAtgJ4wCGARgDYCmA3AFADCIKcMa8yaFavQZQAFCyhQAkINqN0AEwwA5HgHEUIKBBDoAsnBABNKAGkUJuAFUYYdMo4o9KVVGVgYbq0iQAaCdIALgCWgYxQAGqGbAAShqIATACsSQCUbh5ePv6SUgDGAPYAdoEMJZHRcSCJKenunsreSCyprCwADgBOVADmpFRQgXIMAPoAHsFFAGYForLCrSws9gSanva2UCwylMNiIWEMvlCFJWWB6SxRSFYoJNuiAOQxDHR0BccA7gWddAqPx0eSB+DFIUGC7QAzgBXUiPVpAA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGBFIpLtFQ4AFSI6BgBeGrg5dH76AApzbr6B8wBKLLkiGRkAYQrJFRLJgG8s6AhZifIASRkIav85GXQAIWxGM+50AGUn7nIZSYWAGkO0HQgXoVxGt3QADUiGJ1pgYZMAEwAVmR-0BUA6QVeYJud2hsPhYiRqPRRwAvksjnI0ugYJJ0EgXiQCipyK9JkU4NsShBBgA+CBcnm4OQnAYXKnQFZrACyDNOnK2O3wAogAG0MULlSUxiDyACjgBdBZuI5gcqjUgGWwFSZEXAcbgkCBK7hfEjA4oLPmCg5HYDAISkBjsRAyIjjNhpIVh-DYErYHIQTDpchZIjJIiBY69U5yBNpLQwWQAMXI6BImEmWo6Hq93ENR2g-ubbeB6FB1XM9w4BogyU0cBk5ibbaOWPZ2m7Mgqmj8OaIbPQo615KypqyGazOfF9C1cmSqYKAFEDAIxKoYRwANLkDj7LVHPfnS7VR7PDkARjJ48pB8kNQIyCGtx2bOtcgbMcwO1bkVV9CBWxg5sCnQSQxF4JDkPHDsu3BDoSEjUDsJI8wAFUgMjb5uz+CAnxI6BhRVPVO3TBjx1-diA2AMjnQiNlXgTRg+EIZInCYbAADc2K47iiG1dQ7AYdIJDEejkNAdSYMnHFriMOQCKIrTSIo4DqIsWjjOwpjdR09ArLbTjZIgQNWgciByTNbD1zAzdKTcIA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgWwJ7QEMAjAGwFMBuIA)

Auto-increment columns are special and require [extra effort](declaring-the-primary-key.md#enableExplicitAutoIncrementValue) to declare as mutable.

-----

### `.removeAllMutable()`

You should not have to use this method often, if at all.

-----

### `.removeMutable()`

You should not have to use this method often, if at all.
