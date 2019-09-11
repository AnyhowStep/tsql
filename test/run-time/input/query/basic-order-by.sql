SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn"
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
  ("myTable"."myBoolColumn" IS NOT NULL) DESC
