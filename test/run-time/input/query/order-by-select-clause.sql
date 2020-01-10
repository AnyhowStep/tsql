SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  PI() AS "$aliased--pi"
FROM
  "myTable"
ORDER BY
  "myTable"."myBoolColumn" ASC,
  "myTable"."myBoolColumn" ASC,
  "myTable"."myBoolColumn" DESC,
  ("myTable"."myBoolColumn" IS NOT NULL) ASC,
  ("myTable"."myBoolColumn" IS NOT NULL) ASC,
  ("myTable"."myBoolColumn" IS NOT NULL) DESC,
  ("myTable"."myBoolColumn" IS NOT NULL) ASC,
  ("myTable"."myBoolColumn" IS NOT NULL) ASC,
  ("myTable"."myBoolColumn" IS NOT NULL) DESC,
  "$aliased--pi" ASC,
  "$aliased--pi" ASC,
  "$aliased--pi" DESC,
  ("$aliased--pi" IS NOT NULL) ASC,
  ("$aliased--pi" IS NOT NULL) ASC,
  ("$aliased--pi" IS NOT NULL) DESC,
  ("$aliased--pi" IS NOT NULL) ASC,
  ("$aliased--pi" IS NOT NULL) ASC,
  ("$aliased--pi" IS NOT NULL) DESC
