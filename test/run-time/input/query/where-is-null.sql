SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn"
FROM
  "myTable"
CROSS JOIN
  "myTable2"
CROSS JOIN
  "myTable3"
WHERE
  ("myTable2"."myDoubleColumn" IS NULL) AND
  ("myTable"."myBoolColumn" IS NULL)
