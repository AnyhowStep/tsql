import {SelectClause, SelectClauseUtil} from "../../../select-clause";
import {IColumn} from "../../../column/column";
import {ColumnUtil} from "../../../column";
import {IExprSelectItem} from "../../../expr-select-item";
import {ColumnAlias, FindWithColumnAlias} from "../query";
import {ColumnMap} from "../../column-map";
import {ColumnRefUtil, ColumnRef} from "../../../column-ref";
import {Writable, Identity} from "../../../type-util";
import {fromSelectItem} from "./from-select-item";

export type FromSelectClause<
    SelectClauseT extends SelectClause,
    TableAliasT extends string
> =
    Identity<{
        readonly [columnAlias in SelectClauseUtil.ColumnAlias<SelectClauseT>] : (
            columnAlias extends Extract<SelectClauseT[number], IColumn>["columnAlias"] ?
            ColumnUtil.WithTableAlias<
                Extract<SelectClauseT[number], { columnAlias : columnAlias }>,
                TableAliasT
            > :

            columnAlias extends Extract<SelectClauseT[number], IExprSelectItem>["alias"] ?
            ColumnUtil.WithTableAlias<
                ColumnUtil.FromExprSelectItem<Extract<SelectClauseT[number], { alias : columnAlias }>>,
                TableAliasT
            > :

            columnAlias extends ColumnAlias<Extract<SelectClauseT[number], ColumnMap>> ?
            ColumnUtil.WithTableAlias<
                FindWithColumnAlias<
                    Extract<SelectClauseT[number], ColumnMap>,
                    columnAlias
                >,
                TableAliasT
            > :

            columnAlias extends ColumnRefUtil.ColumnAlias<Extract<SelectClauseT[number], ColumnRef>> ?
            ColumnUtil.WithTableAlias<
                ColumnRefUtil.FindWithColumnAlias<
                    Extract<SelectClauseT[number], ColumnRef>,
                    columnAlias
                >,
                TableAliasT
            > :

            never
        )
    }>
;

/**
 * Assumes no duplicate `columnAlias` in `SelectClauseT`
 */
export function fromSelectClause<SelectClauseT extends SelectClause, TableAliasT extends string> (
    selectsClause : SelectClauseT,
    tableAlias : TableAliasT,
    preserveUnaliasedAst : boolean
) : FromSelectClause<SelectClauseT, TableAliasT> {
    const result : Writable<ColumnMap> = {};
    for (const item of selectsClause) {
        const map = fromSelectItem(item);
        for (const columnAlias of Object.keys(map)) {
            if (preserveUnaliasedAst) {
                result[columnAlias] = ColumnUtil.withTableAlias(
                    map[columnAlias],
                    tableAlias
                );
            } else {
                result[columnAlias] = ColumnUtil.withUnaliasedAst(
                    ColumnUtil.withTableAlias(
                        map[columnAlias],
                        tableAlias
                    ),
                    undefined
                );
            }
        }
    }
    return result as FromSelectClause<SelectClauseT, TableAliasT>;
}
