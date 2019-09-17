import * as tsql from "../../../../../dist";

export const p = tsql.selectValue(() => 42)
    .fetchAllUnmapped(
        null as any
    );
