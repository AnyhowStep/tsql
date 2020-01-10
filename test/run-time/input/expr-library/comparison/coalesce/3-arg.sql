COALESCE(
  FALSE,
  (
    SELECT
      FALSE AS "$aliased--value"
  ),
  FALSE
)
