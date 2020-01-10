SELECT
  *
FROM
  (
    SELECT
      PI() AS "$aliased--pi"
    FROM
      "myTable"
    ORDER BY
      "myTable"."myBoolColumn" ASC,
      "$aliased--pi" ASC
    LIMIT
      1
    OFFSET
      0
  )
ORDER BY
  "$aliased--pi" DESC
