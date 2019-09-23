(
  9001e0 IN(
    COALESCE(
      (
        SELECT
          "myTable"."myColumn" AS "myTable--myColumn"
        FROM
          "myTable"
        LIMIT
          1
        OFFSET
          0
      ),
      0e0
    ),
    7e0,
    6e0,
    5e0,
    4e0,
    3e0,
    2e0
  )
)
