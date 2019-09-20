SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  "myTable"."myDoubleColumn" AS "myTable--myDoubleColumn"
FROM
  "myTable"
UNION ALL
SELECT
  *
FROM
  (
    SELECT
      ("myTable2"."someOtherColumn" > 0.4e0) AS "__aliased--gt",
      "myTable2"."someOtherColumn" AS "myTable2--someOtherColumn"
    FROM
      "myTable2"
    ORDER BY
      "__aliased--gt" DESC
  )
