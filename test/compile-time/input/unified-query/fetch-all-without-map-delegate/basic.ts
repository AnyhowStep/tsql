import * as tsql from "../../../../../dist";

export const p = tsql.selectValue(() => 42)
    .fetchAll(
        null as any
    );
