SELECT
  PI() AS "__aliased--pi"
FROM
  "myTable"
ORDER BY
  "myTable"."myBoolColumn" ASC,
  "__aliased--pi" ASC
