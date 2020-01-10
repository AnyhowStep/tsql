import * as tsql from "../../../../../dist";

export const row = tsql.selectValue(() => 42)
    .map((row) => {
        return {
            x : row.$aliased.value + 58,
        };
    })
    .fetchOneOrUndefined(
        null as any
    );
