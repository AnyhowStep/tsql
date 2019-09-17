import * as tsql from "../../../../../dist";

export const row = tsql.selectValue(() => 42)
    .fetchOneOrUndefined(
        null as any
    );
