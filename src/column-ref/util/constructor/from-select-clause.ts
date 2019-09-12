import {SelectClause} from "../../../select-clause";
import {ColumnUtil} from "../../../column";
import {FromColumnUnion} from "./from-column-union";
import {WritableColumnRef} from "../../column-ref";
import {setColumn} from "./from-column";

export type FromSelectClause<
    SelectClauseT extends SelectClause
> =
    FromColumnUnion<
        ColumnUtil.FromSelectClause<SelectClauseT>
    >
;

export function fromSelectClause<
    SelectClauseT extends SelectClause
> (
    selectClause : SelectClauseT
) : (
    FromSelectClause<SelectClauseT>
) {
    const result : WritableColumnRef = {};
    for (const column of ColumnUtil.fromSelectClause(selectClause)) {
        setColumn(result, column);
    }
    return result as FromSelectClause<SelectClauseT>;
}
