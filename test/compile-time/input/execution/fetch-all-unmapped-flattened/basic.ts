import * as tsql from "../../../../../dist";

export const p = tsql.ExecutionUtil.fetchAllUnmappedFlattened(
    tsql.selectValue(() => 42),
    null as any
);
