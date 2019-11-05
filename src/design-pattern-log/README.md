### `log`

Enables use of the audit log pattern/storing time-series data.

### Use Case

We might have a **person**, and we want to **track** their **position** and **heart rate** over time.

We might have the following table called `personJogData`,

|personId|position|heartRate|loggedAt               |
|--------|--------|---------|-----------------------|
|John    |(3,4)   |60 BPM   |2019-01-01 00:00:00.000|
|Mary    |(35,76) |43 BPM   |2018-30-17 15:43:34.777|
|...     |...     |...      |...                    |

-----

### Terminology

+ `logTable`

  The table we will be using to store time-series data.

  Referring back to the example,
  this is our `personJobData` table and will hold the **position** and **heart rate** data.

+ `ownerTable`

  The table that "owns" the time-series data.

  Referring back to the example,
  the **person** is the `owner` of the data.

+ `ownerIdentifier`

  This is the primary key of the `ownerTable`.

  Referring back to the example,
  this is `(personId)`.

+ `newestOrder`

  The `[IColumn, SortDirection]` tuple that sorts rows of the `logTable` from newest to oldest.

  The (`ownerIdentifier`, `newestOrder`) pair must be a candidate key of the `logTable`.

  Referring back to the example,
  this is `[loggedAt, DESC]`

+ `tracked`

  The set of columns we are tracking over time.

  Referring back to the example,
  this is `position` and `heartRate`.

+ `doNotCopy`

  Values we do not want to copy when adding a row to the `logTable`.

  When attempting to insert new data,
  values for these columns must always be provided.

  Consider the following `logTable`,

  |ownerId|value|updatedAt|updatedBy|
  |-------|-----|---------|---------|

  + The `ownerIdentifier` is `ownerId`
  + The `tracked` is `value`
  + The `newestOrder` is `[updatedAt, DESC]`
  + The `doNotCopy` is `updatedBy`

  -----

  If user X says, "Update X's value to 5",
  we add a row,

  |ownerId|value|updatedAt|updatedBy|
  |-------|-----|---------|---------|
  |X      |5    |10:00AM  |X        |

  -----

  Then, when user Y says, "Update X's value to 5",
  we notice that all `tracked` column values have not changed.

  So, we do not add a row.

  -----

  Then, when user Z says, "Update X's value to 6",
  we add a row,

  |ownerId|value|updatedAt|updatedBy|
  |-------|-----|---------|---------|
  |X      |6    |12:00PM  |Z        |
  |X      |5    |10:00AM  |X        |

  So, we can change the value of `updatedBy`, but only
  if the value of whatever is being tracked changes.

+ `copy`

  Columns not in `ownerIdentifier`, `tracked`, `newestOrder`, and `doNotCopy` are implicitly copied over when new rows are added.

+ `copyDefaultsDelegate`

  When invoked, returns default values of `copy` columns.
  Each entity may have different default values
  when no data is logged yet.

+ `trackedDefaults`

  The default value of `tracked` columns.
  These values apply to all entities with no data
  logged yet.

-----

### Notes

+ The builder pattern used here is ugly because of,
  https://github.com/microsoft/TypeScript/issues/34907#issuecomment-549761050
