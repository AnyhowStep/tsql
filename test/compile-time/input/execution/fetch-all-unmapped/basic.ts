import * as tsql from "../../../../../dist";

export const p = tsql.ExecutionUtil.fetchAllUnmapped(
    tsql.selectValue(() => 42),
    null as any
);
