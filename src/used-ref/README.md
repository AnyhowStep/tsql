Used references are supposed to be contravariant.

-----

An expression using `tableAlias.columnAlias BIGINT` cannot be assigned
to an expression using `tableAlias.columnAlias BIGINT|NULL`.

The expression is not expecting the column to possibly be `NULL`.

-----

An expression using `tableAlias.columnA, tableAlias.columnB` cannot be assigned
to an expression using `tableAlias.columnA`.

The expression is using an extra column.

-----
