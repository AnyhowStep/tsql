import {SelectClause} from "../../../select-clause";
import {ColumnIdentifierUtil} from "../../../column-identifier";
import {FromColumnUnion} from "./from-column-union";
import {WritableColumnIdentifierRef} from "../../column-identifier-ref";
import {appendColumn} from "./from-column";

export type FromSelectClause<
    SelectClauseT extends SelectClause
> =
    FromColumnUnion<
        ColumnIdentifierUtil.FromSelectClause<SelectClauseT>
    >
;

export function fromSelectClause<
    SelectClauseT extends SelectClause
> (
    selectClause : SelectClauseT
) : (
    FromSelectClause<SelectClauseT>
) {
    const result : WritableColumnIdentifierRef = {};
    for (const columnIdentifier of ColumnIdentifierUtil.fromSelectClause(selectClause)) {
        appendColumn(result, columnIdentifier);
    }
    return result as FromSelectClause<SelectClauseT>;
}
