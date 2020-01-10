SELECT
  PI() AS "$aliased--pi"
FROM
  "myTable"
ORDER BY
  "$aliased--pi" DESC
LIMIT
  2
OFFSET
  0
