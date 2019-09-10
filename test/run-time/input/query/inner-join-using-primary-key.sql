SELECT
  "myTable"."ck0" AS "myTable--ck0"
FROM
  "myTable"
INNER JOIN
  "myTable2"
ON
  "myTable"."ck0" IS "myTable2"."ck0"
INNER JOIN
  "myTable3"
ON
  ("myTable"."ck1" IS "myTable3"."ck1") AND
  ("myTable"."ck2" IS "myTable3"."ck2")
