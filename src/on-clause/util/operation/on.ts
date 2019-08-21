import {FromClauseUtil} from "../../../from-clause";
import {allowedColumnRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";
import {IAliasedTable} from "../../../aliased-table";
import {OnDelegate} from "../../on-delegate";
import {OnClause} from "../../on-clause";

export function on<
    FromClauseT extends Pick<FromClauseUtil.AfterFromClause, "currentJoins">,
    AliasedTableT extends IAliasedTable
> (
    fromClause : FromClauseT,
    aliasedTable : AliasedTableT,
    onDelegate : OnDelegate<FromClauseT, AliasedTableT>
) : (
    OnClause
) {
    const columns = allowedColumnRef(fromClause, aliasedTable);
    const operand = onDelegate(columns);

    UsedRefUtil.assertAllowed(
        { columns },
        operand.usedRef
    );

    return operand;
}
