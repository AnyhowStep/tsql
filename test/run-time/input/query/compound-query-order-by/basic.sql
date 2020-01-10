SELECT
  ("myTable"."myColumn" + 32) AS "$aliased--x"
FROM
  "myTable"
UNION ALL
SELECT
  "otherTable"."otherColumn" AS "otherTable--otherColumn"
FROM
  "otherTable"
ORDER BY
  "$aliased--x" ASC
