SELECT
  ("myTable"."myColumn" + 32) AS "__aliased--x"
FROM
  "myTable"
UNION ALL
SELECT
  "otherTable"."otherColumn" AS "otherTable--otherColumn"
FROM
  "otherTable"
ORDER BY
  "__aliased--x" ASC
