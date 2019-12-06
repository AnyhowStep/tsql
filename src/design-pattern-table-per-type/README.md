### `table-per-type`

Adds table-per-type inheritance.

-----

### Use Case

-----

### Terminology

+ Exclusive vs Inclusive
+ Abstract vs Concrete
+ Incomplete vs Complete

-----

### Notes

+ https://stackoverflow.com/questions/3579079/how-can-you-represent-inheritance-in-a-database
+ https://stackoverflow.com/questions/12032348/how-are-super-and-subtype-relationships-in-er-diagrams-represented-as-tables
+ https://www.postgresql.org/docs/10/ddl-inherit.html

-----

From https://www.postgresql.org/docs/10/ddl-inherit.html,

> A table can inherit from more than one parent table,
> in which case it has the union of the columns defined by the parent tables.
> Any columns declared in the child table's definition are added to these.

> If the same column name appears in multiple parent tables,
> or in both a parent table and the child's definition,
> then these columns are “merged” so that there is only one such column in the child table.

> To be merged, columns must have the same data types, else an error is raised.

> Inheritable check constraints and not-null constraints are merged in a similar fashion.
> Thus, for example, a merged column will be marked not-null
> if any one of the column definitions it came from is marked not-null.

> Check constraints are merged if they have the same name, and the merge will fail if their conditions are different.
