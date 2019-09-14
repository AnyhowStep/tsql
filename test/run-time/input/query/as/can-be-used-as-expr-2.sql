(
  (
    SELECT
      ("myTable"."myTableId" > "somethingElse"."boop") AS "__aliased--result"
    FROM
      "myTable"
    LIMIT
      1
    OFFSET
      0
  ) IS NOT NULL
)
