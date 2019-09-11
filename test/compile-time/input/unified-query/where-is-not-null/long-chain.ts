import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        column0 : tm.mysql.bigIntUnsigned().orNull(),
        column1 : tm.mysql.bigIntUnsigned().orNull(),
        column2 : tm.mysql.bigIntUnsigned().orNull(),
        column3 : tm.mysql.bigIntUnsigned().orNull(),
        column4 : tm.mysql.bigIntUnsigned().orNull(),
        column5 : tm.mysql.bigIntUnsigned().orNull(),
        column6 : tm.mysql.bigIntUnsigned().orNull(),
        column7 : tm.mysql.bigIntUnsigned().orNull(),
        column8 : tm.mysql.bigIntUnsigned().orNull(),
        column9 : tm.mysql.bigIntUnsigned().orNull(),
        column10 : tm.mysql.bigIntUnsigned().orNull(),
        column11 : tm.mysql.bigIntUnsigned().orNull(),
        column12 : tm.mysql.bigIntUnsigned().orNull(),
        column13 : tm.mysql.bigIntUnsigned().orNull(),
        column14 : tm.mysql.bigIntUnsigned().orNull(),
        column15 : tm.mysql.bigIntUnsigned().orNull(),
        column16 : tm.mysql.bigIntUnsigned().orNull(),
        column17 : tm.mysql.bigIntUnsigned().orNull(),
        column18 : tm.mysql.bigIntUnsigned().orNull(),
        column19 : tm.mysql.bigIntUnsigned().orNull(),
        column20 : tm.mysql.bigIntUnsigned().orNull(),
        column21 : tm.mysql.bigIntUnsigned().orNull(),
        column22 : tm.mysql.bigIntUnsigned().orNull(),
        column23 : tm.mysql.bigIntUnsigned().orNull(),
        column24 : tm.mysql.bigIntUnsigned().orNull(),
        column25 : tm.mysql.bigIntUnsigned().orNull(),
        column26 : tm.mysql.bigIntUnsigned().orNull(),
        column27 : tm.mysql.bigIntUnsigned().orNull(),
        column28 : tm.mysql.bigIntUnsigned().orNull(),
        column29 : tm.mysql.bigIntUnsigned().orNull(),
        column30 : tm.mysql.bigIntUnsigned().orNull(),
        column31 : tm.mysql.bigIntUnsigned().orNull(),
        column32 : tm.mysql.bigIntUnsigned().orNull(),
        column33 : tm.mysql.bigIntUnsigned().orNull(),
        column34 : tm.mysql.bigIntUnsigned().orNull(),
        column35 : tm.mysql.bigIntUnsigned().orNull(),
        column36 : tm.mysql.bigIntUnsigned().orNull(),
        column37 : tm.mysql.bigIntUnsigned().orNull(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereIsNotNull(
        columns => columns.column0
    )
    .whereIsNotNull(
        columns => columns.column1
    )
    .whereIsNotNull(
        columns => columns.column2
    )
    .whereIsNotNull(
        columns => columns.column3
    )
    .whereIsNotNull(
        columns => columns.column4
    )
    .whereIsNotNull(
        columns => columns.column5
    )
    .whereIsNotNull(
        columns => columns.column6
    )
    .whereIsNotNull(
        columns => columns.column7
    )
    .whereIsNotNull(
        columns => columns.column8
    )
    .whereIsNotNull(
        columns => columns.column9
    )
    .whereIsNotNull(
        columns => columns.column10
    )
    .whereIsNotNull(
        columns => columns.column11
    )
    .whereIsNotNull(
        columns => columns.column12
    )
    .whereIsNotNull(
        columns => columns.column13
    )
    .whereIsNotNull(
        columns => columns.column14
    )
    .whereIsNotNull(
        columns => columns.column15
    )
    .whereIsNotNull(
        columns => columns.column16
    )
    .whereIsNotNull(
        columns => columns.column17
    )
    .whereIsNotNull(
        columns => columns.column18
    )
    .whereIsNotNull(
        columns => columns.column19
    )
    .whereIsNotNull(
        columns => columns.column20
    )
    .whereIsNotNull(
        columns => columns.column21
    )
    .whereIsNotNull(
        columns => columns.column22
    )
    .whereIsNotNull(
        columns => columns.column23
    )
    .whereIsNotNull(
        columns => columns.column24
    )
    .whereIsNotNull(
        columns => columns.column25
    )
    .whereIsNotNull(
        columns => columns.column26
    )
    .whereIsNotNull(
        columns => columns.column27
    )
    .whereIsNotNull(
        columns => columns.column28
    )
    .whereIsNotNull(
        columns => columns.column29
    )
    .whereIsNotNull(
        columns => columns.column30
    )
    .whereIsNotNull(
        columns => columns.column31
    )
    .whereIsNotNull(
        columns => columns.column32
    )
    .whereIsNotNull(
        columns => columns.column33
    )
    .whereIsNotNull(
        columns => columns.column34
    )
    .whereIsNotNull(
        columns => columns.column35
    )
    .whereIsNotNull(
        columns => columns.column36
    );
/**
 * @todo Find a way to increase the limit to 60 or more
 */
query.whereIsNotNull(
    columns => columns.column37
);
