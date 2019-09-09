https://www.postgresql.org/docs/8.3/queries-order.html

> ORDER BY can be applied to the result of a UNION, INTERSECT, or EXCEPT combination, but in this case
> it is only permitted to sort by output column names or numbers, not by expressions.

-----

PostgreSQL does not allow ordering by expressions in the `UNION ORDER BY` clause.
However, MySQL does.

-----

The workaround for PostgreSQL is to just...
Add the expressions you want to sort by in the `SELECT` clause.

-----

Having to add the expression to the SELECT is actually a really dumb workaround.
It means you have to duplicate the expression for every SELECT statement you're trying to UNION
```sql
(SELECT *, x+y+z AS sortExpr FROM ...)
UNION
(SELECT *, x+y+z AS sortExpr FROM ...)
UNION
(SELECT *, x+y+z AS sortExpr FROM ...)
ORDER BY
sortExpr
```

Whereas this is much better,
```sql
(SELECT * FROM ...)
UNION
(SELECT * FROM ...)
UNION
(SELECT * FROM ...)
ORDER BY
x+y+z
```

-----

You can also do,
```sql
SELECT
    *
FROM
    (
        (SELECT * FROM ...)
        UNION
        (SELECT * FROM ...)
        UNION
        (SELECT * FROM ...)
    ) AS tmp
ORDER BY
    x+y+z
```

But wrapping it in another `SELECT`...
