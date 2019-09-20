SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn"
FROM
  "myTable"
CROSS JOIN
  "myTable2"
CROSS JOIN
  "myTable3"
WHERE
  "myTable"."myBoolColumn" AND
  ("myTable2"."myDoubleColumn" > 3.141e0) AND
  (TRUE <> "myTable"."myBoolColumn")
