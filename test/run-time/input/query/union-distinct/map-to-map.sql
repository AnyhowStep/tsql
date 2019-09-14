SELECT
  "myTable"."udX" AS "myTable--udX",
  "myTable"."udY" AS "myTable--udY",
  "myTable"."udZ" AS "myTable--udZ"
FROM
  "myTable"
UNION
SELECT
  "myTable2"."udX" AS "myTable2--udX",
  "myTable2"."udY" AS "myTable2--udY",
  "myTable2"."udZ" AS "myTable2--udZ"
FROM
  "myTable2"
