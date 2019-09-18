import * as tsql from "../../../../../dist";

export const row = tsql.selectValue(() => 42)
    .map((row) => {
        return {
            x : row.__aliased.value + 58,
        };
    })
    .fetchOneOr(
        null as any,
        "Hello, world"
    );
