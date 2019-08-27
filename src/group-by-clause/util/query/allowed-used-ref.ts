import {IFromClause, FromClauseUtil} from "../../../from-clause";
import {ColumnIdentifierRefUtil, ColumnIdentifierRef} from "../../../column-identifier-ref";
import {SelectClause} from "../../../select-clause";

export type AllowedColumnIdentifierRef<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> =
    ColumnIdentifierRefUtil.Intersect<
        FromClauseUtil.AllowedColumnIdentifierRef<FromClauseT, { isLateral : true }>,
        (
            SelectClauseT extends SelectClause ?
            ColumnIdentifierRefUtil.FromSelectClause<SelectClauseT> :
            {}
        )
    >
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
