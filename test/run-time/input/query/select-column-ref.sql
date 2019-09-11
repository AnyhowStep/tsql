SELECT
  "tableA"."a" AS "tableA--a",
  "tableA"."b" AS "tableA--b",
  "tableA"."c" AS "tableA--c",
  "tableA"."x" AS "tableA--x",
  "tableA"."y" AS "tableA--y",
  "tableA"."z" AS "tableA--z",
  "tableB"."a" AS "tableB--a",
  "tableB"."b" AS "tableB--b",
  "tableB"."c" AS "tableB--c",
  "tableB"."x" AS "tableB--x",
  "tableB"."y" AS "tableB--y",
  "tableB"."z" AS "tableB--z",
  "tableC"."a" AS "tableC--a",
  "tableC"."b" AS "tableC--b",
  "tableC"."c" AS "tableC--c",
  "tableC"."x" AS "tableC--x",
  "tableC"."y" AS "tableC--y",
  "tableC"."z" AS "tableC--z"
FROM
  "tableC"
CROSS JOIN
  "tableA"
CROSS JOIN
  "tableB"
