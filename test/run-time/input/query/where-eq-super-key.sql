SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn"
FROM
  "myTable"
WHERE
  (
    "myTable"."myDateTimeColumn" IS strftime('%Y-%m-%d %H:%M:%f', '2010-02-03 23:34:45.456')
  ) AND
  ("myTable"."myDoubleColumn" IS 3.141e0) AND
  ("myTable"."myBoolColumn" IS FALSE) AND
  (
    "myTable"."myDateTimeColumn" IS strftime('%Y-%m-%d %H:%M:%f', '2010-02-03 23:34:45.456')
  ) AND
  ("myTable"."myDoubleColumn" IS 3.141e0)
