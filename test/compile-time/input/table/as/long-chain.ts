import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
        column0 : tm.mysql.varChar(255),
        column1 : tm.mysql.varBinary(255),
        column2 : tm.mysql.dateTime(3),
        column3 : tm.mysql.intUnsigned(),
        column4 : tm.mysql.bigIntUnsigned(),
        column5 : tm.mysql.boolean(),
        column6 : tm.mysql.json(),
        column7 : tm.mysql.varChar(255),
        column8 : tm.mysql.varChar(255),
        /**
         * Comment
         */
        column9 : tm.mysql.varChar(255),
    });

export const aliasedTable = myTable
    .as("0")
    .as("1")
    .as("2")
    .as("3")
    .as("4")
    .as("5")
    .as("6")
    .as("7")
    .as("8")
    .as("9")
    .as("10")
    .as("11")
    .as("12")
    .as("13")
    .as("14")
    .as("15")
    .as("16")
    .as("17")
    .as("18")
    .as("19");
    //.as("20");
    //.as("21");
/**
 * The type of `columns.column0.columnAlias` is all messed up.
 * No max-depth error, though.
 *
 * https://github.com/microsoft/TypeScript/issues/32707 might be related.
 *
 * 1. Mouse over `aliasedTable`, resolves correctly
 * 2. Mouse over `aliasedTable2`, resolves correctly
 * 3. Type some random text
 * 4. Mouse over `aliasedTable2`, resolve to `any` <-- Wtf?
 * 5. Mouse over `aliasedTable`, resolve to `any` <-- Wtf?
 * 6. Delete the random text
 * 7. Mouse over `aliasedTable2`, resolve to `any` <-- Wtf?
 * 8. Mouse over `aliasedTable`, resolve to `any` <-- Wtf?
 */
export const aliasedTable2 = aliasedTable.as("22");
