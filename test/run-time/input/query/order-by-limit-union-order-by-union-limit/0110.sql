SELECT
  *
FROM
  (
    SELECT
      PI() AS "$aliased--pi"
    FROM
      "myTable"
    LIMIT
      1
    OFFSET
      0
  )
ORDER BY
  "$aliased--pi" DESC
