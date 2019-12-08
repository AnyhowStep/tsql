import * as tsql from "../../../../../dist";

const parent = tsql.table("parent")
    .addColumns({
        appKeyId : tsql.dtBigIntSigned(),
    })
    .setId(c => c.appKeyId);

const child = tsql.table("child")
    .addColumns({
        otherId : tsql.dtBigIntSigned(),
    })
    .setId(c => c.otherId);

export const {
    autoIncrement,
    explicitAutoIncrementValueEnabled,
} = tsql.tablePerType(child)
    .addParent(parent);
