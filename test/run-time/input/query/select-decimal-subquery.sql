SELECT
  CAST(
    (
      SELECT
        CAST('1.234' AS DECIMAL(10, 4)) AS "__aliased--value"
    ) AS DECIMAL(42, 10)
  ) AS "__aliased--value"
