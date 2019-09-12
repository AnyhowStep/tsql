SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  PI() AS "__aliased--pi"
FROM
  "myTable"
ORDER BY
  "myTable"."myBoolColumn" ASC,
  "myTable"."myBoolColumn" ASC,
  "myTable"."myBoolColumn" DESC,
  "__aliased--pi" ASC,
  "__aliased--pi" ASC,
  "__aliased--pi" DESC
