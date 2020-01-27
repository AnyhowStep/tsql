import {IFromClause} from "../../../from-clause";
import {ColumnIdentifierRefUtil, ColumnIdentifierRef} from "../../../column-identifier-ref";
import {SelectClause} from "../../../select-clause";
import {IJoin} from "../../../join";

/**
 * https://stackoverflow.com/questions/59922428/portable-group-by-clause-rules/59922712#59922712
 *
 * 1. Aliased expressions in the `SELECT` clause **must not** be used in the `GROUP BY` clause
 *    + MySQL allows this
 * 2. Columns from outer queries **must not** be used in the `GROUP BY` clause
 *    + No databases allow this
 * 3. The `GROUP BY` clause **must not** contain non-column expressions
 *    + MySQL, PostgreSQL, SQLite, MS SQL Server all support this
 *    + This is not part of the SQL standard, however
 */
export type AllowedColumnIdentifierRef<
    FromClauseT extends IFromClause,
    _SelectClauseT extends SelectClause|undefined
> =
    ColumnIdentifierRefUtil.FromJoinArray<
        FromClauseT["currentJoins"] extends readonly IJoin[] ?
        FromClauseT["currentJoins"] :
        never
    >
    /**
     * This `infer X` business is because TS 3.7 thinks this is not assignable to `ColumnIdentifierRef`
     * when it clearly is...
     *
     * @todo Investigate
     * /
    ColumnIdentifierRefUtil.Intersect<
        FromClauseUtil.AllowedColumnIdentifierRef<FromClauseT, { isLateral : true }>,
        (
            SelectClauseT extends SelectClause ?
            ColumnIdentifierRefUtil.FromSelectClause<SelectClauseT> :
            {}
        )
    > extends infer X ?
    Extract<X, ColumnIdentifierRef> :
    never
    //*/
;
export function allowedColumnIdentifierRef<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> (
    fromClause : FromClauseT,
    _selectClause : SelectClauseT
) : (
    AllowedColumnIdentifierRef<FromClauseT, SelectClauseT>
) {
    return ColumnIdentifierRefUtil.fromJoinArray(
        fromClause.currentJoins != undefined ?
        fromClause.currentJoins :
        []
    ) as ColumnIdentifierRef as AllowedColumnIdentifierRef<FromClauseT, SelectClauseT>;
    /*
    const fromClauseIdentifiers = FromClauseUtil.allowedColumnIdentifierRef(fromClause, { isLateral : true });
    const selectClauseIdentifiers = (
        selectClause == undefined ?
        {} :
        ColumnIdentifierRefUtil.fromSelectClause(selectClause as Exclude<SelectClauseT, undefined>)
    );
    const result = ColumnIdentifierRefUtil.intersect(
        fromClauseIdentifiers,
        selectClauseIdentifiers
    ) as ColumnIdentifierRef as AllowedColumnIdentifierRef<FromClauseT, SelectClauseT>;
    return result;
    */
}
