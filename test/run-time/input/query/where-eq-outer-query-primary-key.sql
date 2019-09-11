SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn"
FROM
  "myTable"
WHERE
  (
    "myTable"."myDoubleColumn" IS "outerTable"."myDoubleColumn"
  ) AND
  (
    "myTable"."myDateTimeColumn" IS "outerTable"."myDateTimeColumn"
  )
