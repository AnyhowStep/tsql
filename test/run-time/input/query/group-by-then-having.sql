SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn"
FROM
  "myTable"
CROSS JOIN
  "myTable2"
CROSS JOIN
  "myTable3"
GROUP BY
  "myTable"."myBoolColumn",
  "myTable2"."myDoubleColumn"
HAVING
  "myTable"."myBoolColumn" AND
  ("myTable2"."myDoubleColumn" > 3.141) AND
  (TRUE <> "myTable"."myBoolColumn")
