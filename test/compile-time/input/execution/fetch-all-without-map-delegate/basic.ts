import * as tsql from "../../../../../dist";

export const p = tsql.ExecutionUtil.fetchAll(
    tsql.selectValue(() => 42),
    null as any
);
