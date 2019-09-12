SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  PI() AS "__aliased--pi"
FROM
  "myTable"
CROSS JOIN
  "myTable2"
CROSS JOIN
  "myTable3"
GROUP BY
  "myTable"."myBoolColumn",
  "myTable2"."myDoubleColumn",
  "__aliased--pi"
