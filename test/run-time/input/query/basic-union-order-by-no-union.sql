SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  PI() AS "$aliased--pi"
FROM
  "myTable"
ORDER BY
  "myTable"."myBoolColumn" ASC,
  "myTable"."myBoolColumn" ASC,
  "myTable"."myBoolColumn" DESC,
  "$aliased--pi" ASC,
  "$aliased--pi" ASC,
  "$aliased--pi" DESC
