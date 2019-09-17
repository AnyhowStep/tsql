import * as tsql from "../../../../../dist";

export const resultSet = tsql.selectValue(() => 42)
    .map(async (row) => {
        return {
            x : row.__aliased.value + 58,
        };
    })
    .fetchAllMapped(
        null as any
    );
