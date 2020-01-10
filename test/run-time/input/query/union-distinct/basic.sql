SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  "myTable"."myDoubleColumn" AS "myTable--myDoubleColumn"
FROM
  "myTable"
UNION
SELECT
  ("myTable2"."someOtherColumn" > 0.4e0) AS "$aliased--gt",
  "myTable2"."someOtherColumn" AS "myTable2--someOtherColumn"
FROM
  "myTable2"
