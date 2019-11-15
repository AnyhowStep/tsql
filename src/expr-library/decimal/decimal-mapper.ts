import * as tm from "type-mapping/fluent";

/**
 * We make this precision and scale far larger than what a database
 * can reasonably reach.
 *
 * PostgreSQL has max precision 1,000.
 *
 * Precision 40,000 and scale 20,000 seems like a safe bet, right?
 */
export const decimalMapper = tm.mysql.decimal(
    40000,
    20000
);
