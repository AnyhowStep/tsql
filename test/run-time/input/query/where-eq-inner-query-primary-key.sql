SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn"
FROM
  "outerTable"
WHERE
  (
    "myTable"."myDoubleColumn" IS "outerTable"."myDoubleColumn"
  ) AND
  (
    "myTable"."myDateTimeColumn" IS "outerTable"."myDateTimeColumn"
  )
