SELECT
  "test"."testId" AS "test--testId",
  "test"."testVal" AS "test--testVal",
  "aliased"."otherVal" AS "aliased--otherVal"
FROM
  "test"
INNER JOIN
  "main"."other" AS "aliased"
ON
  "test"."testId" IS "aliased"."testId"
ORDER BY
  "test"."testId" DESC
