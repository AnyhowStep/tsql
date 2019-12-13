import * as tsql from "../../../../dist";

export const customerPayInMethod = tsql.table("customerPayInMethod")
    .addColumns({
        payInMethodId : tsql.dtBigIntSigned(),
        platformId : tsql.dtBigIntSigned(),
        name : tsql.dtVarChar(1, 512),
    })
    .setPrimaryKey(columns => [
        columns.payInMethodId,
        columns.platformId,
    ])
    .addMutable(c => [
        c.name,
    ])
    .addCandidateKey(c => [c.name]);

export const cardCustomerPayInMethod = tsql.table("cardCustomerPayInMethod")
    .addColumns({
        payInMethodId : tsql.dtBigIntSigned(),
        platformId : tsql.dtBigIntSigned(),
        sansitiveInformation : tsql.dtVarChar(1, 512),
    })
    .setPrimaryKey(columns => [
        columns.payInMethodId,
        columns.platformId,
    ])
    .removeAllMutable();

export const cardCustomerPayInMethodTpt = tsql.tablePerType(cardCustomerPayInMethod)
    .addParent(customerPayInMethod);
