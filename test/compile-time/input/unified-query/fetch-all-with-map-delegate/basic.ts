import * as tsql from "../../../../../dist";

export const resultSet = tsql.selectValue(() => 42)
    .map((row) => {
        return {
            x : row.__aliased.value + 58,
        };
    })
    .fetchAll(
        null as any
    );
