import {ITable} from "../../table";
import {ColumnMap} from "../../../column-map";
import {Key} from "../../../key";
import {ColumnUtil} from "../../../column";
import {ExtractCandidateKeysWithColumnAliasInTable_Input} from "./extract-candidate-keys-with-column-alias-in-table";

/**
 *
 * + Assumes `SrcMapT` may be a union
 * + Assumes `ValidKeyT` may be a union
 * + Assumes `ValidKeyT` was obtained with `ExtractValidKey<SrcMapT, DstMapT>`
 */
type ColumnArraysFromCandidateKeysImpl<
    SrcMapT extends ColumnMap,
    ValidKeyT extends Key
> = (
    ValidKeyT extends Key ?
    (
        & readonly (
            ColumnUtil.FromColumnMap<
                Pick<SrcMapT, ValidKeyT[number]>
            >
        )[]
        /**
         * Hack to force TS to infer a non-empty tuple type, rather than array type.
         * This is required to catch the following case,
         * ```ts
         *  const myTable = table("myTable")
         *      .addColumns({
         *          outerTableIdA : tm.mysql.bigIntUnsigned(),
         *          outerTableIdB : tm.mysql.boolean(),
         *          otherColumn : tm.mysql.varChar(),
         *      });
         *  const outerTable = table("outerTable")
         *      .addColumns({
         *          outerTableIdA : tm.mysql.bigIntUnsigned(),
         *          outerTableIdB : tm.mysql.boolean(),
         *          outerColumn : tm.mysql.varChar(),
         *      })
         *      .setPrimaryKey(c => [c.outerTableIdA, c.outerTableIdB]);
         *  eqCandidateKeyOfTable(
         *      myTable,
         *      outerTable,
         *      c => (
         *          //Without the "infer tuple" hack,
         *          //TS will infer,
         *          //(typeof c.outerTableIdA|typeof c.outerTableIdB)[]
         *          //This will pass the compile-time check but throw a run-time error
         *          //because [outerTableIdA] is not a candidate key.
         *          //Only [outerTableIdA, outerTableIdB] is a candidate key.
         *          Math.random() > 0.5 ?
         *          [c.outerTableIdA, c.outerTableIdB] :
         *          [c.outerTableIdA]
         *      )
         *  )
         * ```
         */
        & { "0" : unknown }
    ) :
    never
);
/**
 * + Assumes `SrcT` may be a union
 * + Assumes `DstT` may be a union
 *
 * For each "compatible" candidate key in `DstT`,
 * it returns an array of columns from `SrcT`
 * that have column aliases from the candidate key
 *
 */
export type ColumnArraysFromCandidateKeys<
    SrcT extends Pick<ITable, "columns">,
    DstT extends Pick<ITable, "candidateKeys">,
> = (
    ColumnArraysFromCandidateKeysImpl<
        SrcT["columns"],
        ExtractCandidateKeysWithColumnAliasInTable_Input<DstT, SrcT>
    >
);
