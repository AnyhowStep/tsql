import {FromClauseUtil} from "../../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {AllowedUsedRef, allowedUsedRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";

export type AssertValidUsedRef<
    FromClauseT extends FromClauseUtil.AfterFromClause,
    AliasedTableT extends IAliasedTable,
    RawOnClauseT extends BuiltInExpr<boolean>
> = (
    UsedRefUtil.AssertAllowed<
        AllowedUsedRef<FromClauseT, AliasedTableT>,
        BuiltInExprUtil.UsedRef<RawOnClauseT>
    >
);

export function assertValidUsedRef (
    fromClause : FromClauseUtil.AfterFromClause,
    aliasedTable : IAliasedTable,
    rawOnClause : BuiltInExpr<boolean>
) {
    UsedRefUtil.assertAllowed(
        allowedUsedRef(fromClause, aliasedTable),
        BuiltInExprUtil.usedRef(rawOnClause)
    );
}
