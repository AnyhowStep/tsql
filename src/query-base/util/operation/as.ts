import {OneSelectItem, ZeroOrOneRow, AfterSelectClause} from "../helper-type";
import {DerivedTable} from "../../../derived-table";
import {UsedRefUtil} from "../../../used-ref";
import {IJoin} from "../../../join";
import {ColumnMapUtil} from "../../../column-map";
import {Mapper, mapper} from "../query";
import {ALIASED} from "../../../constants";
import {DerivedTableSelectItem} from "../../../derived-table-select-item";
import {SelectClauseUtil} from "../../../select-clause";
import {CompileError} from "../../../compile-error";
import {isOneSelectItem, isZeroOrOneRow} from "../predicate";

export type As<QueryT extends AfterSelectClause, AliasT extends string> =
    QueryT extends (OneSelectItem<any> & ZeroOrOneRow) ?
    DerivedTableSelectItem<{
        mapper : Mapper<QueryT>,
        isLateral : false,
        tableAlias : typeof ALIASED,
        alias : AliasT,
        columns : ColumnMapUtil.FromSelectClause<
            QueryT["selectClause"],
            AliasT
        >,
        usedRef : UsedRefUtil.FromJoinArray<
            QueryT["fromClause"]["outerQueryJoins"] extends readonly IJoin[] ?
            QueryT["fromClause"]["outerQueryJoins"] :
            []
        >,
    }> :
    DerivedTable<{
        isLateral : false,
        alias : AliasT,
        columns : ColumnMapUtil.FromSelectClause<
            QueryT["selectClause"],
            AliasT
        >,
        usedRef : UsedRefUtil.FromJoinArray<
            QueryT["fromClause"]["outerQueryJoins"] extends readonly IJoin[] ?
            QueryT["fromClause"]["outerQueryJoins"] :
            []
        >,
    }>
;

export type AssertAliasable<QueryT extends AfterSelectClause> =
    SelectClauseUtil.DuplicateColumnAlias<QueryT["selectClause"]> extends never ?
    unknown :
    CompileError<[
        "Cannot alias query with duplicate names in SELECT clause",
        SelectClauseUtil.DuplicateColumnAlias<QueryT["selectClause"]>
    ]>
;

function assertAliasable (query : AfterSelectClause) {
    const duplicateColumnAlias = SelectClauseUtil.duplicateColumnAlias(query.selectClause);
    if (duplicateColumnAlias.length > 0) {
        throw new Error(`Cannot alias query with duplicate names in SELECT clause; ${duplicateColumnAlias.join(", ")}`);
    }
}

export function as<
    QueryT extends AfterSelectClause,
    AliasT extends string
> (
    query : QueryT,
    alias : AliasT & AssertAliasable<QueryT>
) : (
    As<QueryT, AliasT>
) {
    assertAliasable(query);

    if (isOneSelectItem(query) && isZeroOrOneRow(query)) {
        const result = new DerivedTableSelectItem(
            {
                mapper : mapper(query),
                isLateral : false,
                tableAlias : ALIASED,
                alias,
                columns : (
                    ColumnMapUtil.fromSelectClause<
                        QueryT["selectClause"],
                        AliasT
                    >(query.selectClause, alias, false)
                ),
                usedRef : UsedRefUtil.fromJoinArray(
                    query.fromClause.outerQueryJoins == undefined ?
                    [] :
                    query.fromClause.outerQueryJoins
                ),
            },
            query
        );
        /**
         * @todo Investigate why we can't cast to `As<>` directly
         */
        return result as unknown as As<QueryT, AliasT>;
    } else {
        const result = new DerivedTable(
            {
                isLateral : false,
                alias,
                columns : (
                    ColumnMapUtil.fromSelectClause<
                        QueryT["selectClause"],
                        AliasT
                    >(query.selectClause, alias, false)
                ),
                usedRef : UsedRefUtil.fromJoinArray(
                    query.fromClause.outerQueryJoins == undefined ?
                    [] :
                    query.fromClause.outerQueryJoins
                ),
            },
            query
        );
        /**
         * @todo Investigate why we can't cast to `As<>` directly
         */
        return result as unknown as As<QueryT, AliasT>;
    }
}
