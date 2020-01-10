SELECT
  "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
  "myTable"."myDoubleColumn" AS "myTable--myDoubleColumn"
FROM
  "myTable"
UNION
SELECT
  *
FROM
  (
    SELECT
      ("myTable2"."someOtherColumn" > 0.4e0) AS "$aliased--gt",
      "myTable2"."someOtherColumn" AS "myTable2--someOtherColumn"
    FROM
      "myTable2"
    UNION
    SELECT
      ("myTable3"."blahColumn" = 42e0) AS "$aliased--eq",
      "myTable3"."blahColumn" AS "myTable3--blahColumn"
    FROM
      "myTable3"
  )
