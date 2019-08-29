import {IFromClause} from "../../../from-clause";
import {HavingDelegate} from "../../having-delegate";
import {HavingClause} from "../../having-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {and} from "../../../expr-library";
import {allowedColumnRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";

/**
 * Returns the MySQL equivalent of `havingClause AND havingDelegate(columns)`
 *
 * -----
 *
 * For now, this is basically the same as `WhereClauseUtil.where<>()`.
 *
 * They will diverge when,
 * + The `HAVING` clause enforces proper `GROUP BY` interactions.
 *
 * -----
 *
 * @param fromClause
 * @param havingClause
 * @param havingDelegate
 */
export function having<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT,
    havingClause : HavingClause|undefined,
    havingDelegate : HavingDelegate<FromClauseT>
) : (
    HavingClause
) {
    const columns = allowedColumnRef(fromClause);
    const operand = havingDelegate(ColumnRefUtil.tryFlatten(
        columns
    ));

    UsedRefUtil.assertAllowed(
        { columns },
        operand.usedRef
    );

    return (
        havingClause == undefined ?
        operand :
        and(havingClause, operand)
    );
}
