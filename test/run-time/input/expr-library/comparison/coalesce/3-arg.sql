COALESCE(
  FALSE,
  (
    SELECT
      FALSE AS "__aliased--value"
  ),
  FALSE
)
