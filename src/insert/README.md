
### `ON DUPLICATE KEY`/`ON CONFLICT`/`MERGE`

How often do you all use `ON DUPLICATE KEY`/`ON CONFLICT`/`MERGE` for `INSERT` statements?
It's annoying that I don't see anything on the SQL standard about "upsert" behaviour.
"Upsert" is also generally unsafe for replication.

So, I'm curious if it's even a thing people use.
I've personally not had to use it too often, and I have zero usages for my current project at work.

https://en.wikipedia.org/wiki/Merge_(SQL)

The implementations are all so different, I can't reasonably unify them =/

-----

Seems like the most portable thing to do is,

1. `START TRANSACTION;`
1. `SELECT EXISTS(...)`
1. If exists, `UPDATE`. Otherwise, `INSERT`
1. `COMMIT;`

https://dba.stackexchange.com/questions/157403/should-i-be-wary-of-on-duplicate-key-update

-----

Can easily be unified if table has only one unique key.

-----

### `INSERT`

+ MySQL       : `INSERT ...`
+ PostgreSQL  : `INSERT ...`
+ SQLite      : `INSERT ...`

-----

### `INSERT IGNORE`

+ MySQL       : `INSERT IGNORE ...`
+ PostgreSQL  : `INSERT ... ON CONFLICT DO NOTHING`
  + https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT
+ SQLite      : `INSERT OR IGNORE ...`

-----

### `REPLACE`

+ MySQL       : `REPLACE ...`
+ PostgreSQL  : ??? `INSERT ... ON CONFLICT ... DO UPDATE ...` but update every single column?
  + Can easily be emulated if the table has only one unique key.
  + https://www.postgresql.org/message-id/3A9D57F4.E85E3E6E%40agliodbs.com
  + `ON CONFLICT ... DO UPDATE` only supports one key, though.
    + Possible for tables to have multiple keys
  + For `INSERT ... VALUES ...`, it is relatively easy to emulate this behaviour.
    1. `START TRANSACTION;`
    1. `SELECT EXISTS(...)`
    1. If exists, `UPDATE` all columns. Otherwise, `INSERT`.
    1. `COMMIT;`
  + https://stackoverflow.com/questions/35888012/use-multiple-conflict-target-in-on-conflict-clause
+ SQLite      : `REPLACE ...`

-----

### `INSERT INTO ... SELECT`

+ MySQL       : `INSERT ... SELECT ...`
+ PostgreSQL  : `INSERT ... SELECT ...`
+ SQLite      : `INSERT ... SELECT ...`

-----

### `INSERT IGNORE INTO ... SELECT`

+ MySQL       : `INSERT IGNORE ... SELECT ...`
+ PostgreSQL  : `INSERT ... SELECT ... ON CONFLICT DO NOTHING`
  + https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT
+ SQLite      : `INSERT OR IGNORE ... SELECT ...`

-----

### `REPLACE INTO ... SELECT`

How to emulate this for `PostgreSQL`?

+ MySQL       : `REPLACE ... SELECT ...`
+ PostgreSQL  : ???
  + Can easily be emulated if the table has only one unique key.
+ SQLite      : `REPLACE ... SELECT ...`

PostgreSQL is unable to handle tables with multiple unique keys,
```sql
CREATE TABLE myTable (
	a INT,
	b INT,
	c INT,
  	PRIMARY KEY (a, b),
  	UNIQUE  (b, c)
);
INSERT INTO
	myTable(a, b, c)
VALUES
	(4, 3, 2);

INSERT INTO
	myTable(a, b, c)
VALUES
	(5, 3, 2)
-- Invalid syntax in PostgreSQL but we need something like this to safely "replace into" myTable
ON CONFLICT (a, b), (b, c)
DO UPDATE SET
	a = EXCLUDED.a,
    b = EXCLUDED.b,
    c = EXCLUDED.c;

-- Expect (5,3,2)
SELECT * FROM myTable;
```

-----

### SQLite and `DEFAULT` value for columns

https://stackoverflow.com/questions/35108116/insert-default-value-for-single-field-with-sqlite

MySQL/PostgreSQL,
```sql
INSERT INTO
  myTable(a, b, c)
VALUES
  (4, 3, DEFAULT);
```

SQLite,
```sql
INSERT INTO
  myTable(a, b)
VALUES
  (4, 3);
```

-----

### `LAST_INSERT_ID()`

+ MySQL       : `LAST_INSERT_ID()`
  + https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_last-insert-id
+ PostgreSQL  : `... RETURNING /* AUTO_INCREMENT COLUMN NAME */`
  + https://stackoverflow.com/questions/2944297/postgresql-function-for-last-inserted-id
+ SQLite      : `LAST_INSERT_ROWID()`
  + https://www.sqlite.org/lang_corefunc.html#last_insert_rowid
