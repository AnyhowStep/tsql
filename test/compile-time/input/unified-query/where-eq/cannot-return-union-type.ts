import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
        otherColumn : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEq(
        /**
         * It impossible for `WhereEqDelegate<>`
         * to return a union type.
         *
         * This is unfortunate but a necessary compromise for now.
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
         */
        columns => Math.random() > 0.5 ? columns.otherColumn : columns.myTableId,
        1n
    );
