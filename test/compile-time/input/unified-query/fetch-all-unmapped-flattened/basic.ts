import * as tsql from "../../../../../dist";

export const p = tsql.selectValue(() => 42)
    .fetchAllUnmappedFlattened(
        null as any
    );
