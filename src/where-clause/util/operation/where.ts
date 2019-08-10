import {IFromClause} from "../../../from-clause";
import {WhereDelegate} from "../../where-delegate";
import {WhereClause} from "../../where-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {and} from "../../../expr-library";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {ColumnIdentifierArrayUtil} from "../../../column-identifier";
import {WhereClauseUtil} from "../..";

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
    const columns = WhereClauseUtil.allowedColumnRef(fromClause);
    const operand = whereDelegate(ColumnRefUtil.tryFlatten(
        columns
    ));

    ColumnIdentifierRefUtil.assertHasColumnIdentifiers(
        columns,
        ColumnIdentifierArrayUtil.fromColumnRef(operand.usedRef.columns)
    );

    return (
        whereClause == undefined ?
        operand :
        and(whereClause, operand)
    );
}
