import * as tsql from "../../../../../dist";

const atwcmbmA = tsql.table("atwcmbmA")
    .addColumns({
        atwcmbmX : tsql.dtBigIntSigned(),
        x : tsql.dtBigIntSigned().orNull(),
    })
    .addMutable(columns => [columns.x])
    .setPrimaryKey(columns => [columns.atwcmbmX]);
const atwcmbmB = tsql.table("atwcmbmB")
    .addColumns({
        atwcmbmX : tsql.dtBigIntSigned(),
        x : tsql.dtBigIntSigned().orNull(),
    })
    .addMutable(columns => [columns.x])
    .setPrimaryKey(columns => [columns.atwcmbmX]);
const atwcmbmC = tsql.table("atwcmbmC")
    .addColumns({
        atwcmbmX : tsql.dtBigIntSigned(),
        x : tsql.dtBigIntSigned(),
    })
    .addMutable(columns => [columns.x])
    .setPrimaryKey(columns => [columns.atwcmbmX]);

export const bTpt = tsql.tablePerType(atwcmbmB)
    .addParent(atwcmbmA);

export const cTpt = tsql.tablePerType(atwcmbmC)
    .addParent(bTpt);

export const bNullable = tsql.TablePerTypeUtil.nullableColumnAliases(bTpt);
export const cNullable = tsql.TablePerTypeUtil.nullableColumnAliases(cTpt);
