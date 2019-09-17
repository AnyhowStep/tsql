import * as tsql from "../../../../../dist";

export const p = tsql.ExecutionUtil.fetchAllUnmapped(
    tsql.selectValue(() => 42)
        .map(() => undefined),
    null as any
);
