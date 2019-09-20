SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn"
FROM
  "myTable"
CROSS JOIN
  "myTable2"
CROSS JOIN
  "myTable3"
WHERE
  ("myTable2"."myDoubleColumn" = 42e0) AND
  ("myTable"."myBoolColumn" = TRUE)
