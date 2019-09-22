import {IFromClause, FromClauseUtil} from "../../../from-clause";
import {ColumnIdentifierRefUtil, ColumnIdentifierRef} from "../../../column-identifier-ref";
import {SelectClause} from "../../../select-clause";

export type AllowedColumnIdentifierRef<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> =
    /**
     * This `infer X` business is because TS 3.7 thinks this is not assignable to `ColumnIdentifierRef`
     * when it clearly is...
     *
     * @todo Investigate
     */
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
;
export function allowedColumnIdentifierRef<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> (
    fromClause : FromClauseT,
    selectClause : SelectClauseT
) : (
    AllowedColumnIdentifierRef<FromClauseT, SelectClauseT>
) {
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
}
