SELECT
  "test"."testId" AS "test--testId",
  "test"."testVal" AS "test--testVal",
  "aliased"."otherVal" AS "aliased--otherVal",
  "aliased"."testId" AS "aliased--testId"
FROM
  "test"
INNER JOIN
  "other" AS "aliased"
ON
  "test"."testId" IS "aliased"."testId"
ORDER BY
  "test"."testId" DESC
