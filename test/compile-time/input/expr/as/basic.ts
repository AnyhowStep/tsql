import * as tsql from "../../../../../dist";

export const expr = tsql.and(true, true);
export const aliasedExprA = expr.as("a");
export const aliasedExprB = aliasedExprA.as("b");
