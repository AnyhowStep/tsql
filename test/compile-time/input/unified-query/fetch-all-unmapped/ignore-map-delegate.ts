import * as tsql from "../../../../../dist";

export const p = tsql.selectValue(() => 42)
    .map(() => undefined)
    .fetchAllUnmapped(
        null as any
);
