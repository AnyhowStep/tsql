import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : () => {
            return {
                x : 1,
                y : 1,
            } as number|{ x : number, y : number };
        },
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEq(
        columns => columns.myTableId,
        2
    );
