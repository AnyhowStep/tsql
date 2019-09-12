SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  PI() AS "__aliased--pi"
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
  "__aliased--pi" ASC,
  "__aliased--pi" ASC,
  "__aliased--pi" DESC,
  ("__aliased--pi" IS NOT NULL) ASC,
  ("__aliased--pi" IS NOT NULL) ASC,
  ("__aliased--pi" IS NOT NULL) DESC,
  ("__aliased--pi" IS NOT NULL) ASC,
  ("__aliased--pi" IS NOT NULL) ASC,
  ("__aliased--pi" IS NOT NULL) DESC
