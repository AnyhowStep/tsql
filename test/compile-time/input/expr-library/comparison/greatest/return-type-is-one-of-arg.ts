import * as tsql from "../../../../../../dist";

export const expr0 = tsql.greatest(1, 2, 3, 9, 8, 7);

export const expr1 = tsql.greatest(1n, 2n, 3n, 9n, 8n, 7n);

export const expr2 = tsql.greatest("1", "2", "3", "4", "5", "6");

export const expr3 = tsql.greatest("1", "2", "3", "4", "5", "6", tsql.coalesce(null, "7"));
