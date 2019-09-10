import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        myOtherTableId : tm.mysql.bigIntUnsigned(),
    });

declare const myDerivedTable : tsql.DerivedTable<{
    isLateral : false,
    alias : "myDerivedTable",
    columns : {
    },
    usedRef : tsql.IUsedRef<{
        myOtherTable : {
            myOtherTableId : bigint,
        }
    }>,
}>;
tsql.QueryUtil.newInstance()
    .requireOuterQueryJoins(myOtherTable)
    .from(myTable)
    .leftJoin(
        myDerivedTable,
        () => true
    );
