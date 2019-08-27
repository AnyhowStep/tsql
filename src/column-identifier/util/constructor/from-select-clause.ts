import {ColumnIdentifier} from "../../column-identifier";
import {SelectClause} from "../../../select-clause";
import {FromSelectItem, fromSelectItem} from "./from-select-item";

/**
 * For output positions
 */
export type FromSelectClause<SelectClauseT extends SelectClause> = (
    SelectClauseT extends SelectClause ?
    FromSelectItem<SelectClauseT[number]> :
    never
);

/**
 * Does not remove duplicate identifiers
 *
 * @param selectClause
 */
export function fromSelectClause<
    SelectClauseT extends SelectClause
> (
    selectClause : SelectClauseT
) : (
    FromSelectClause<SelectClauseT>[]
) {
    const result : ColumnIdentifier[] = [];
    for (const selectItem of selectClause) {
        result.push(...fromSelectItem(selectItem));
    }
    return result as FromSelectClause<SelectClauseT>[];
}
