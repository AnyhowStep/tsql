### Declaring default values

Most columns do not have default values.

When performing an INSERT, we must provide values for all columns that do not have default values.

However, if a column has a default value,
then we can let the database use it for INSERTs.

-----

### Nullable columns

Nullable columns have an implicit default value of `NULL`.

```ts
import * as sql from "@squill/squill";

const myTable = sql.table("myTable")
    .addColumns({
        myTableId : sql.dtBigIntSigned(),
        title : sql.dtVarChar(255),
        //Implicit default value of `NULL`
        createdAt : sql.dtDateTime(3).orNull(),
    })
    .setAutoIncrement(columns => columns.myTableId);
```

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUAtgJ4wCGARgDYCmA3AFADCIKcMa8yaFavQZQAFCyhQAkINqN0AEwwA5HgHEUIKBBDoAsnBABNKAGkUJuAFUYYdMo4o9KVVGVgYbq0iQAaCdIALgCWgYxQAGqGbAAShqIATACsSQCUbh5ePv6SUgDGAE4MVIEMCnCBUMDcKDD6KKIAzOnK3kgsqawsAA4FVADmpFRQgXIMAPoAHsEAdgBmAPaissKdLCz2BJqe9rZQLDKUY2IhYQzpLFFIVigkB6IA5DEMdHQLvlAA7gsFdAoPnSAA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGBFIpLtFQ4AFSI6BgBeGrg5dH76AApzbr6B8wBKLLkiGRkAYQrJFRLJgG8s6AhZifIASRkIav85GXQAIWxGM+50AGUn7nIZSYWAGkO0HQgXoVxGt3QADUiGJ1pgYZMAEwAVmR-0BUBIBSIQRkMG01yMEIAIjjyD1VORJsEFnJNAA5SQIX4Ao4AXyWRzkaXQMEk6CQLyx5BU5FekyKcG2JQggwAfBBJdLcHITgMLgs3EcwOVRqQDLYCpMiLgONwSBAJcUviRgcUFrKFQcjsBgEJSAx2IgZDj+ibCl78NgStgchBMOlyFkOqUeGktN8AEpIZKy4jJIiBY69U5yYPx3myABi5HQJEwkwxiutuTt3FZR2gzsbLeB6FB1XM9w45D+EGSmjgMnMDZbLuAPX4BHw3CQ2gKBuwBUuNFyREkaSr4+SDHhADdPbxPAESFmcih13BtHv2JJyAox43XcKyXiCRBuEy4KPG2yspro2KXAKnvFhGGmfN0lxZNkhHOMoKTFMAMAzp4ITGQYMRNMiAzLM1XoPMSigmBi1LctK0fDobTrH8jmbR8oDbDsLAACWwR4+wHMQhxHLdoFdFiU3IA8xE4hgVBECA1AkPdQ0PCByAADzUE9Aj4qBXRvKUGBQTQ+EKLYdlosdXXzIJVmQNAN2DRh9OycgLyZa9byjBjoBfXF8TBL5U1JIJpkRAAGABGQL4hC8Lgp6YLgkqQLAriwK5HiwKAC1FmMqA-yOACjhjEC5DAiCiPQzC4Mg0qU0RACOTcIA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgWwJ7QEMAjAGwFMBuIA)

-----

### `.addExplicitDefaultValue()`

```ts
import * as sql from "@squill/squill";

const myTable = sql.table("myTable")
    .addColumns({
        myTableId : sql.dtBigIntSigned(),
        title : sql.dtVarChar(255),
        createdAt : sql.dtDateTime(3),
    })
    .setAutoIncrement(columns => columns.myTableId)
    .addExplicitDefaultValue(columns => [
        columns.createdAt
    ]);
```

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUAtgJ4wCGARgDYCmA3AFADCIKcMa8yaFavQZQAFCyhQAkINqN0AEwwA5HgHEUIKBBDoAsnBABNKAGkUJuAFUYYdMo4o9KVVGVgYbq0iQAaCdIALgCWgYxQAGqGbAAShqIATACsSQCUbh5ePv6SUgDGAE4MVIEMCnCBUMDcKDD6KKIAzOnunsreSFUomNZInqIAzoEFAGYhpAyiAOQApEYAtDOki0ozMQBcM3qbI1O+UFMAdgD2AO5TqaksqawsAA4FVADmpFRQgXIMAPoAHsGHI2OolkwhuLBY9gImk89lsUBYMkonzEITCDHSLCiSCsKBICOmMQYdDox32p2OBToCguTCAA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGBFIpLtFQ4AFSI6BgBeGrg5dH76AApzbr6B8wBKLLkiGRkAYQrJFRLJgG8s6AhZifIASRkIav85GXQAIWxGM+50AGUn7nIZSYWAGkO0HQgXoVxGt3QADUiGJ1pgYZMAEwAVmR-0BUBIBSIQRkMG01yMEIAIjjyD1VORJsF0UcAL5LI5yNLoGCSdBIF5Y8gqcivSZFODbEoQQYAPggguFuDkJwGF0Z0BWawAogAPNQBEiBYnkFBESRwKHsSRUqU7fDiiAAbQxkq2Frk3LJePQWQAugs3EcwOVRqQDLYCpMiLgONwSBABcUviRgcUFqKJQcjsBgEJSAx2IgZDj+qHCtn8NgStgchBMOlyFkOqUeGktN8AEpIZKi4jJIiBY69U5yEsN1myABi5HQJEwkztHVj8e4AKORxTi5XwPQoOq5nuHHIfwgyU0cBk5gXK8XaZ6-AI+G4SG0BUD2AKlxouQNaTtqeAyQY8IAblmvDkBqWrdjk+qGtof4muQChnuewDOri+Jgl8bakkEvyniudJZF6NbFLgFSwSwjDTAO6S4i2yQnvWlHNq2+EEZ0dGNjI1GIu2RCdt2cr0P2JSUTAI5jhOU7wTOuRzthi7LvBUBrhuFgABLYI8e4HmIR4np+0BpsprbkABYgaQwKgiBAagSH+ZaARAwGatg2puvJenANBQoMCgmh8IUDrzrpUBpgOQSrMgaCSNQ3CML52R6gaRoQB5pqBZK2LIQSEBoRAGFUuYiIAAwAIwFfExVlUVPRFcElQFQVtUFXIdUFQAWosMn0nh3rQLWxFyKR5GCWxHG0RRw2toi+EMm4QA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgWwJ7QEMAjAGwFMBuIA)

-----

### `.removeExplicitDefaultValue()`

You should not have to use this method often, if at all.
