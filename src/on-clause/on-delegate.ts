//import * as tm from "type-mapping";
import {FromClauseUtil} from "../from-clause";
import {IAliasedTable} from "../aliased-table";
//import {IExpr} from "../expr";
import * as OnClauseUtil from "./util";
import {BuiltInExpr} from "../built-in-expr";
import {AssertValidUsedRef} from "./util";

export type OnDelegate<
    FromClauseT extends FromClauseUtil.AfterFromClause,
    AliasedTableT extends IAliasedTable,
    RawOnClauseT extends BuiltInExpr<boolean>
> =
    (
        columns : OnClauseUtil.AllowedColumnRef<FromClauseT, AliasedTableT>
    ) => (
        & RawOnClauseT
        & AssertValidUsedRef<FromClauseT, AliasedTableT, RawOnClauseT>
        /*IExpr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : OnClauseUtil.AllowedUsedRef<FromClauseT, AliasedTableT>
        }>*/
    )
;
