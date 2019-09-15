COALESCE(
  (
    SELECT DISTINCT
      "myTable"."myTableId" AS "myTable--myTableId"
    FROM
      "myTable"
    LIMIT
      1
    OFFSET
      0
  ),
  'someDefaultValue'
)
