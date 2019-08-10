import * as tsql from "../../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : () => true
    });
export const useColumn = tsql.and3(myTable.columns.myColumn);
