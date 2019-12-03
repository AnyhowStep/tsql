import * as tsql from "../../../../../dist";

const atwcmbmA = tsql.table("atwcmbmA")
    .addColumns({
        x : tsql.dtBigIntSigned().orNull(),
    })
    .addMutable(columns => [columns.x]);
const atwcmbmB = tsql.table("atwcmbmB")
    .addColumns({
        x : tsql.dtBigIntSigned().orNull(),
    })
    .addMutable(columns => [columns.x]);
const atwcmbmC = tsql.table("atwcmbmC")
    .addColumns({
        x : tsql.dtBigIntSigned(),
    })
    .addMutable(columns => [columns.x]);

export const bTpt = tsql.tablePerType(atwcmbmB)
    .addParent(atwcmbmA);

export const cTpt = tsql.tablePerType(atwcmbmC)
    .addParent(bTpt);

export const bNullable = tsql.TablePerTypeUtil.nullableColumnAliases(bTpt);
export const cNullable = tsql.TablePerTypeUtil.nullableColumnAliases(cTpt);
