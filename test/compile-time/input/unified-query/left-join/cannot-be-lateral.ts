import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

declare const myDerivedTable : tsql.DerivedTable<{
    isLateral : false,
    alias : "myDerivedTable",
    columns : {
    },
    usedRef : tsql.IUsedRef<{}>,
}>;

tsql.QueryUtil.newInstance()
    .from(myTable)
    .leftJoin(
        myDerivedTable.lateral(),
        () => true
    );
