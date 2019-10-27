### Goals

+ Single-table update
+ `WHERE`
+ Assignment list

### Non-Goals

+ Multi-table update
  + MySQL supports it
  + PostgreSQL does not
  + SQLite does not
+ `ORDER BY`
  + MySQL supports it
  + PostgreSQL does not
  + SQLite supports it
+ `LIMIT`
  + MySQL supports it
  + PostgreSQL does not
  + SQLite supports it
+ `FROM`
  + MySQL supports it
  + PostgreSQL supports it
  + SQLite does not
+ `ROLLBACK/ABORT/REPLACE/FAIL/IGNORE`
  + MySQL does not support it (MySQL supports `IGNORE`)
  + PostgreSQL does not support it
  + SQLite supports it

-----

```sql
UPDATE
    :table
SET
    :assignment_list
WHERE
    :condition
```
