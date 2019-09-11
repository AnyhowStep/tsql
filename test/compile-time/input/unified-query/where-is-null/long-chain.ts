import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned().orNull(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    )
    .whereIsNull(
        columns => columns.myTableId
    );
/**
 * @todo Find a way to increase the limit to 60 or more
 */
query.whereIsNull(
    columns => columns.myTableId
);
