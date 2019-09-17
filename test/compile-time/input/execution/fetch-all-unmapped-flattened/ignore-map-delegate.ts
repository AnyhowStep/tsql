import * as tsql from "../../../../../dist";

export const p = tsql.ExecutionUtil.fetchAllUnmappedFlattened(
    tsql.selectValue(() => 42)
        .map(() => undefined),
    null as any
);
