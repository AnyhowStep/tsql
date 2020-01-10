SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  PI() AS "$aliased--pi"
FROM
  "myTable"
CROSS JOIN
  "myTable2"
CROSS JOIN
  "myTable3"
GROUP BY
  "myTable"."myBoolColumn",
  "myTable2"."myDoubleColumn",
  "$aliased--pi"
