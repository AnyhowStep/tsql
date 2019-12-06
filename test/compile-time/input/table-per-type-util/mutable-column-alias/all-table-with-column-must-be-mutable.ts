import * as tsql from "../../../../../dist";

const atwcmbmA = tsql.table("atwcmbmA")
    .addColumns({
        x : tsql.dtBigIntSigned(),
    })
    .addMutable(columns => [columns.x]);
const atwcmbmB = tsql.table("atwcmbmB")
    .addColumns({
        x : tsql.dtBigIntSigned(),
    })
    .addMutable(columns => [columns.x]);
const atwcmbmC = tsql.table("atwcmbmC")
    .addColumns({
        x : tsql.dtBigIntSigned(),
    });
    //.addMutable(columns => [columns.x]);

export const bTpt = tsql.tablePerType(atwcmbmB)
    .addParent(atwcmbmA);

export const cTpt = tsql.tablePerType(atwcmbmC)
    .addParent(bTpt);

export const bMutable = tsql.TablePerTypeUtil.mutableColumnAliases(bTpt);
export const cMutable = tsql.TablePerTypeUtil.mutableColumnAliases(cTpt);
