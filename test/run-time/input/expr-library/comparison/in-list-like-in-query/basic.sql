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
    )
  )
)
