SELECT
  PI() AS "$aliased--pi"
FROM
  "myTable"
ORDER BY
  "myTable"."myBoolColumn" ASC,
  "$aliased--pi" ASC
LIMIT
  2
OFFSET
  0
