We want to avoid unsafe three-valued logic,

```
OPERAND1  OPERATOR  OPERAND2  RESULT
------------------------------------
TRUE      AND       TRUE      TRUE
TRUE      AND       FALSE     FALSE
FALSE     AND       FALSE     FALSE
TRUE      AND       NULL      UNKNOWN
FALSE     AND       NULL      FALSE
NULL      AND       NULL      UNKNOWN
TRUE      OR        TRUE      TRUE
TRUE      OR        FALSE     TRUE
FALSE     OR        FALSE     FALSE
TRUE      OR        NULL      TRUE
FALSE     OR        NULL      UNKNOWN
NULL      OR        NULL      UNKNOWN
```

In general, if you find yourself using logical operators with
nullable expressions, you should consider using `COALESCE()`
with your nullable expressions.
