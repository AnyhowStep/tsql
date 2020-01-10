import * as tsql from "../../../../../dist";

export const resultSet = tsql.ExecutionUtil.fetchAll(
    tsql.selectValue(() => 42)
        .map((row) => {
            return {
                x : row.$aliased.value + 58,
            };
        }),
    null as any
);
