import * as tsql from "../../../../../dist";

const parent = tsql.table("parent")
    .addColumns({
        otherId : tsql.dtBigIntSigned(),
    })
    .setId(c => c.otherId);

const child = tsql.table("child")
    .addColumns({
        appKeyId : tsql.dtBigIntSigned(),
    })
    .setId(c => c.appKeyId);

export const {
    autoIncrement,
    explicitAutoIncrementValueEnabled,
} = tsql.tablePerType(child)
    .addParent(parent);
