SELECT
  decimal_ctor(
    (
      SELECT
        decimal_ctor('1.234', 10, 4) AS "$aliased--value"
    ),
    42,
    10
  ) AS "$aliased--value"
