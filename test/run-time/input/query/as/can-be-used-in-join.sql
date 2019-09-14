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
