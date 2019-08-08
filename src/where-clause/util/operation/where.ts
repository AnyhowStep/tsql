import {IFromClause} from "../../../from-clause";
import {WhereDelegate} from "../../where-delegate";
import {WhereClause} from "../../where-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {and} from "../../../expr-library";

/**
 * Returns the MySQL equivalent of `whereClause AND whereDelegate(columns)`
 *
 * @param fromClause
 * @param whereClause
 * @param whereDelegate
 */
export function where<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    whereDelegate : WhereDelegate<FromClauseT>
) : (
    WhereClause
) {
    const columns = ColumnRefUtil.tryFlatten(
        ColumnRefUtil.fromFromClause(fromClause)
    );
    const operand = whereDelegate(columns);
    return (
        whereClause == undefined ?
        operand :
        and(whereClause, operand)
    );
}
