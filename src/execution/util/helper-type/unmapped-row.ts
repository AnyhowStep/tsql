import {ColumnRefUtil} from "../../../column-ref";
import {TypeRefUtil, TypeRef} from "../../../type-ref";
import {IJoin, JoinArrayUtil} from "../../../join";
import {Merge} from "../../../type-util";
import {QueryBaseUtil} from "../../../query-base";

/**
 * Gives you a `TypeMap`, containing columns from the `TableAliasT`
 */
type RowOfTable<
    RefT extends TypeRef,
    JoinsT extends readonly IJoin[],
    TableAliasT extends string
> = Merge<
    & {
        readonly [columnName in Extract<
            keyof RefT[TableAliasT],
            keyof JoinArrayUtil.ExtractWithTableAlias<JoinsT, TableAliasT>["columns"]
        >] : (
            //Get the real data type
            ReturnType<
                JoinArrayUtil.ExtractWithTableAlias<
                    JoinsT,
                    TableAliasT
                >["columns"][columnName]["mapper"]
            >
        )
    }
    & {
        readonly [columnName in Exclude<
            keyof RefT[TableAliasT],
            keyof JoinArrayUtil.ExtractWithTableAlias<JoinsT, TableAliasT>["columns"]
        >] : (
            //Get the real data type
            RefT[TableAliasT][columnName]
        )
    }
>;
/**
 * @todo Rename?
 */
type ApplyNullableJoins<
    RefT extends TypeRef,
    JoinsT extends readonly IJoin[]
> = Merge<
    //Required
    & {
        readonly [
            tableAlias in Extract<
                JoinArrayUtil.NonNullableTableAlias<JoinsT>,
                keyof RefT
            >
        ] : (
            RowOfTable<RefT, JoinsT, tableAlias>
        )
    }
    //Optional
    & {
        readonly [
            tableAlias in Extract<
                JoinArrayUtil.NullableTableAlias<JoinsT>,
                keyof RefT
            >
        ]? : (
            RowOfTable<RefT, JoinsT, tableAlias>
        )
    }
    //Extras (Like $aliased)
    & {
        readonly [
            tableAlias in Exclude<
                keyof RefT,
                JoinArrayUtil.TableAlias<JoinsT>
            >
        ] : (
            RefT[tableAlias]
        )
    }
>;
export type UnmappedRow<
    QueryT extends Pick<QueryBaseUtil.AfterSelectClause, "selectClause"|"fromClause">
> =
    ApplyNullableJoins<
        TypeRefUtil.FromColumnRef<
            ColumnRefUtil.FromSelectClause<QueryT["selectClause"]>
        >,
        (
            QueryT["fromClause"]["currentJoins"] extends readonly IJoin[] ?
            QueryT["fromClause"]["currentJoins"] :
            []
        )
    >
;
