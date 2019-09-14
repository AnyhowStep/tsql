import * as tsql from "../../../../../dist";

export const aliased = tsql
    .select(() => [
        tsql.and(true, false).as("and"),
        tsql.and(true, false).as("and2")
    ])
    .as("myAlias");
