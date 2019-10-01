### Null-Safe Equality

Null-safe equality behaves almost like "regular" equality,
except that it returns `TRUE` when both operands are `NULL`.

"Regular" equality returns `FALSE` when either (or both) operands are `NULL`.

-----

Different databases use different symbols for null-safe equality,

Database        | Symbol
----------------|-------
MySQL 5.7       | `<=>`
PostgreSQL 9.4  | `IS NOT DISTINCT FROM`
SQLite 3.28     | `IS`

References,
+ https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_equal-to
+ https://www.postgresql.org/docs/9.1/functions-comparison.html
+ https://www.sqlite.org/lang_expr.html#binaryops
