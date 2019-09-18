import * as tsql from "../../../../../dist";

export const row = tsql.selectValue(() => 42)
    .fetchOneOr(
        null as any,
        "Hello, world"
    );
