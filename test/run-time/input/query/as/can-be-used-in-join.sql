SELECT
  "myAlias"."isNotNull" AS "myAlias--isNotNull",
  "myAlias"."myTable2Id" AS "myAlias--myTable2Id",
  "myAlias"."myTable3Id" AS "myAlias--myTable3Id",
  "myAlias"."myTableId" AS "myAlias--myTableId",
  "myTable"."myTableId" AS "myTable--myTableId"
FROM
  "myTable"
CROSS JOIN
  (
    SELECT
      "myTable"."myTableId" AS "myTableId",
      ("myTable"."myTableId" IS NOT NULL) AS "isNotNull",
      "myTable2"."myTable2Id" AS "myTable2Id",
      "myTable3"."myTable3Id" AS "myTable3Id"
    FROM
      "myTable"
    CROSS JOIN
      "myTable2"
    CROSS JOIN
      "myTable3"
  ) AS "myAlias"
WHERE
  ("myAlias"."myTable2Id" > "myTable"."myTableId") AND
  "myAlias"."isNotNull"
