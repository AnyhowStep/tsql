(
  3e0 IN(
    COALESCE(
      (
        SELECT
          "myTable"."myColumn" AS "myTable--myColumn"
        FROM
          "myTable"
        WHERE
          FALSE
        LIMIT
          0
        OFFSET
          0
      ),
      3e0
    )
  )
)
