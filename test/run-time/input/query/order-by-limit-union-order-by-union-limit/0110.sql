SELECT
  *
FROM
  (
    SELECT
      PI() AS "__aliased--pi"
    FROM
      "myTable"
    LIMIT
      1
    OFFSET
      0
  )
ORDER BY
  "__aliased--pi" DESC
