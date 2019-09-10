SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  "myTable2"."column2" AS "myTable2--column2"
FROM
  "myTable"
INNER JOIN
  "myTable2"
ON
  "myTable"."myBoolColumn" AND
  (
    "myTable2"."column2" > ACOS("myTable2"."column2")
  )
INNER JOIN
  "myTable3"
ON
  "myTable2"."column2" IS CAST("myTable3"."column3" AS DOUBLE)
