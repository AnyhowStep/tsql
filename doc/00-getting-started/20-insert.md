### `INSERT`

This library supports a variety of ways to `INSERT` rows to a table.

-----

### `INSERT INTO ... VALUES ...` Overview

`INSERT`,
+ `table.insertOne()`
+ `table.insertMany()`
+ `table.insertAndFetch()`

`INSERT IGNORE`,
+ `table.insertIgnoreOne()`
+ `table.insertIgnoreMany()`

`REPLACE`,
+ `table.replaceOne()`
+ `table.replaceMany()`

-----

### `INSERT INTO ... SELECT ...` Overview

+ `query.insert()`
+ `query.insertIgnore()`
+ `query.replace()`

-----

### TODO

+ `... ON DUPLICATE KEY UPDATE`
  + Can reasonably be unified if the table only has one candidate key.
