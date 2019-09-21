SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  "myTable2"."column2" AS "myTable2--column2"
FROM
  "myTable"
LEFT JOIN
  "myTable2"
ON
  "myTable"."myBoolColumn" AND
  (
    "myTable2"."column2" > COALESCE(ACOS("myTable2"."column2"), 0e0)
  )
LEFT JOIN
  "myTable3"
ON
  "myTable2"."column2" IS CAST("myTable3"."column3" AS DOUBLE)
