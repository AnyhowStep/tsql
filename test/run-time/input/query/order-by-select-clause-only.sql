SELECT
  PI() AS "$aliased--pi"
ORDER BY
  "$aliased--pi" ASC,
  "$aliased--pi" ASC,
  "$aliased--pi" DESC,
  ("$aliased--pi" IS NOT NULL) ASC,
  ("$aliased--pi" IS NOT NULL) ASC,
  ("$aliased--pi" IS NOT NULL) DESC,
  ("$aliased--pi" IS NOT NULL) ASC,
  ("$aliased--pi" IS NOT NULL) ASC,
  ("$aliased--pi" IS NOT NULL) DESC
