import * as tm from "type-mapping";
import {TableWithPrimaryKey, ITable, TableUtil} from "../../../table";
import {Expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import {and} from "../logical";
import {NullSafeComparison} from "./make-null-safe-comparison";
import {ColumnMap, ColumnMapUtil} from "../../../column-map";
import {Key, KeyArrayUtil, KeyUtil} from "../../../key";
import {ColumnUtil, Column} from "../../../column";

/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.and(
 *          tsql.nullSafeEq(src.dstCk0, dst.dstCk0),
 *          tsql.nullSafeEq(src.dstCk1, dst.dstCk1),
 *          tsql.nullSafeEq(src.dstCk2, dst.dstCk2),
 *          //etc.
 *      ));
 * ```
 * -----
 *
 * + The `src` does not need to have keys.
 * + The `dst` must have a candidate key.
 * + The `src` must have columns **null-safe** comparable to columns of `dst`'s candidate key.
 *
 * -----
 *
 * Uses `nullSafeEq()` internally because `src.dstCkX` may have nullable columns.
 *
 * @param src - A table that does not need keys
 * @param dst - The table with a candidate key to compare against
 */
export type EqPrimaryKeyOfTable = (
    <
        SrcT extends Pick<ITable, "columns">,
        DstT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">
    > (
        src : SrcT,
        dst : (
            & DstT
            & TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
        )
    ) => (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>
    )
);
export function makeEqPrimaryKeyOfTable (
    nullSafeEq : NullSafeComparison
) : (
    EqPrimaryKeyOfTable
) {
    const result : EqPrimaryKeyOfTable = <
        SrcT extends Pick<ITable, "columns">,
        DstT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">
    > (
        src : SrcT,
        dst : (
            & DstT
            /**
             * @todo Investigate
             * Possibly related to,
             * https://github.com/microsoft/TypeScript/issues/32442
             */
            //& TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
        )
    ) : (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>
    ) => {
        TableUtil.assertHasNullSafeComparablePrimaryKey(dst, src.columns);

        /**
         * No need to `.sort()`, just use `primaryKey` and the order
         * the user set.
         */
        const arr = dst.primaryKey.map((columnAlias) => {
            /**
             * We use `nullSafeEq` because `src.dstPkX` may have nullable columns.
             */
            const expr = nullSafeEq(
                src.columns[columnAlias],
                dst.columns[columnAlias]
            );
            return expr as Expr<{
                mapper : tm.SafeMapper<boolean>,
                usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
            }>;
        });
        const result = and(...arr);
        return result as Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>;
    };
    return result;
}

/**
 * @todo rename
 *
 * + Assumes `SrcMapT` may be a union
 * + Assumes `ValidKeyT` may be a union
 * + Assumes `ValidKeyT` was obtained with `ExtractValidKey<SrcMapT, DstMapT>`
 */
type SrcColumns<
    SrcMapT extends ColumnMap,
    ValidKeyT extends Key
> = (
    ValidKeyT extends Key ?
    (
        readonly (
            ColumnUtil.FromColumnMap<
                Pick<SrcMapT, ValidKeyT[number]>
            >
        )[]
    ) :
    never
);
/**
 * + Assumes `SrcMapT` may be a union
 * + Assumes `DstMapT` may be a union
 */
type ExtractValidKey<
    SrcMapT extends ColumnMap,
    DstKeyT extends Key
> = (
    DstKeyT extends Key ?
    (
        /**
         * keyof ({ x:string,y:string }|{ x:string,z:string }) === "x"
         */
        DstKeyT[number] extends keyof SrcMapT ?
        DstKeyT :
        never
    ) :
    never
);
/**
 * + Assumes `SrcMapT` is not a union
 * + Assumes `DstMapT` may be a union
 */
type DistributeAssert<SrcMapT extends ColumnMap, DstMapT extends ColumnMap> = (
    DstMapT extends ColumnMap ?
    (
        & AssertSameOwnEnumerableKeys<
            SrcMapT,
            DstMapT
        >
        & ColumnMapUtil.AssertIsNullSafeComparable<
            SrcMapT,
            DstMapT
        >
    ) :
    never
);
type DistributeAssert2<SrcMapT extends ColumnMap, DstMapT extends ColumnMap> = (
    DstMapT extends ColumnMap ?
    (
        [
            AssertSameOwnEnumerableKeys<
                SrcMapT,
                DstMapT
            >,
            keyof SrcMapT,
            keyof DstMapT,
            ColumnMapUtil.AssertIsNullSafeComparable<
                SrcMapT,
                DstMapT
            >
        ]
    ) :
    never
);
/**
 * + Assumes `SrcMapT` is not a union
 * + Assumes `DstMapT` may be a union
 */
type AssertNullSafeComparableIfSameKeys<SrcMapT extends ColumnMap, DstMapT extends ColumnMap> = (
    DstMapT extends ColumnMap ?
    (
        unknown extends AssertSameOwnEnumerableKeys<
            SrcMapT,
            DstMapT
        > ?
        ColumnMapUtil.AssertIsNullSafeComparable<
            SrcMapT,
            DstMapT
        > :
        unknown
    ) :
    never
);
type CommonCandidateKeys<
    DstT extends Pick<ITable, "candidateKeys">
> = (
    KeyArrayUtil.ExtractKeysInCommon<DstT["candidateKeys"]>
);
/**
 * `SrcT`, `Dst`, and `SrcColumnsT` cannot be unions for simplicity.
 *
 * @param src - A table that does not need keys
 * @param dst - The table with at least one candidate key to compare against
 * @param candidateKeyDelegate - A function that returns columns from `src` matching columns of
 */
function eqCandidateKeyOfTable<
    SrcT extends Pick<ITable, "columns">,
    DstT extends Pick<ITable, "columns"|"candidateKeys">,
    SrcColumnsT extends SrcColumns<SrcT["columns"], ExtractValidKey<SrcT["columns"], CommonCandidateKeys<DstT>>>
> (
    src : SrcT,
    dst : DstT,
    candidateKeyDelegate : (
        (
            columns : Pick<
                SrcT["columns"],
                ExtractValidKey<SrcT["columns"], CommonCandidateKeys<DstT>>[number]
            >
        ) => (
            & SrcColumnsT
            /**
             * Hack to force TS to infer a tuple type, rather than array type.
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
            & (
                KeyUtil.ExcludeIfInKeyArray<
                    KeyUtil.FromColumnArray<SrcColumnsT>,
                    ExtractValidKey<SrcT["columns"], CommonCandidateKeys<DstT>>[]
                > extends never ?
                Extract<
                    UnionToIntersection<
                        SrcColumnsT extends SrcColumnsT ?
                        [
                            AssertNullSafeComparableIfSameKeys<
                                ColumnMapUtil.FromColumnArray<SrcColumnsT>,
                                PickMulti<
                                    DstT["columns"],
                                    KeyUtil.ExtractIfInKeyArray<
                                        KeyUtil.FromColumnArray<SrcColumnsT>,
                                        ExtractValidKey<SrcT["columns"], CommonCandidateKeys<DstT>>[]
                                    >
                                >
                            >
                        ] :
                        never
                    >,
                    [unknown]
                >[0] :
                CompileError<[
                    KeyUtil.ExcludeIfInKeyArray<
                        KeyUtil.FromColumnArray<SrcColumnsT>,
                        ExtractValidKey<SrcT["columns"], CommonCandidateKeys<DstT>>[]
                    >,
                    "is invalid candidate key; expecting one of",
                    ExtractValidKey<SrcT["columns"], CommonCandidateKeys<DstT>>
                ]>
            )
        )
    )
) : (
    (
        & SrcColumnsT
    )
    /*Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
    }>*/
) {
    TableUtil.assertHasNullSafeComparablePrimaryKey(dst, src.columns);

    /**
     * No need to `.sort()`, just use `primaryKey` and the order
     * the user set.
     */
    const arr = dst.primaryKey.map((columnAlias) => {
        /**
         * We use `nullSafeEq` because `src.dstPkX` may have nullable columns.
         */
        const expr = nullSafeEq(
            src.columns[columnAlias],
            dst.columns[columnAlias]
        );
        return expr as Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>;
    });
    const result = and(...arr);
    return result as Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
    }>;
};

import {table} from "../../../table";
import {CompileError} from "../../../compile-error";
import {PickMulti, AssertSameOwnEnumerableKeys, UnionToIntersection, IsUnion, Replace} from "../../../type-util";
import {PopUnion} from "../../../type-util/pop-union";

const myTable = table("myTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
        outerColumn : tm.mysql.varChar(),
    });

const myTable2 = table("myTable2")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
        outerColumn : tm.mysql.varChar(),
    });

const myTable3 = table("myTable3")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.varChar(), //varChar, not boolean
        otherColumn : tm.mysql.varChar(),
        outerColumn : tm.mysql.varChar(),
    });

const outerTable = table("outerTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        outerColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.outerTableIdA, c.outerTableIdB])
    .addCandidateKey(c => [c.outerColumn, c.outerTableIdA]);

const outerTable2 = table("outerTable2")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        outerColumn : tm.mysql.varChar(),
    })
    .addCandidateKey(c => [c.outerColumn, c.outerTableIdA]);

type testA = [typeof myTable.columns.outerTableIdA] extends readonly (Column<{
    tableAlias: "myTable";
    columnAlias: "outerTableIdA";
    mapper: tm.Mapper<unknown, bigint>;
}> | Column<{
    tableAlias: "myTable";
    columnAlias: "outerTableIdB";
    mapper: tm.Mapper<unknown, boolean>;
}>)[] ?
"y" : "n"

const ugh0 = eqCandidateKeyOfTable(
    myTable,
    outerTable,
    //Should be Error
    c => (
        Math.random() > 0.5 ?
        [c.outerTableIdA, c.outerTableIdB] :
        [c.outerTableIdA]
    )
)
type evk = ExtractValidKey<typeof myTable["columns"], typeof outerTable["candidateKeys"][number]>;
type s = SrcColumns<typeof myTable["columns"], evk>;
eqCandidateKeyOfTable(
    myTable,
    outerTable,
    //Should be Error
    c => [c.outerTableIdA]
)

const w = eqCandidateKeyOfTable(
    myTable,
    outerTable,
    //Should be OK
    c => [c.outerTableIdA, c.outerTableIdB]
)

eqCandidateKeyOfTable(
    myTable,
    outerTable,
    //Should be OK
    c => (
        Math.random() > 0.5 ?
        [c.outerTableIdA, c.outerTableIdB] :
        [c.outerTableIdB, c.outerTableIdA]
    )
)

eqCandidateKeyOfTable(
    (Math.random() > 0.5 ? myTable : myTable2),
    outerTable,
    //Should be OK
    c => [c.outerTableIdA, c.outerTableIdB]
);.usedRef.__contravarianceMarker

const x = eqCandidateKeyOfTable(
    (Math.random() > 0.5 ? myTable : myTable3),
    outerTable,
    //Should be Error
    c => [c.outerTableIdA, c.outerTableIdB]
)

const y = eqCandidateKeyOfTable(
    myTable3,
    outerTable,
    //Should be Error
    c => [c.outerTableIdA, c.outerTableIdB]
)

const z = eqCandidateKeyOfTable(
    myTable,
    (Math.random() > 0.5 ? outerTable : outerTable2),
    //Should be Error
    c => [c.outerTableIdB, c.outerTableIdA]
);.usedRef.__contravarianceMarker

eqCandidateKeyOfTable(
    myTable,
    (Math.random() > 0.5 ? outerTable : outerTable2),
    //Should be OK
    c => [c.outerColumn, c.outerTableIdA]
);.usedRef.__contravarianceMarker
type s2 = SrcColumns<
    typeof myTable["columns"],
    ExtractValidKey<
        typeof myTable["columns"],
        (
            |typeof outerTable
            |typeof outerTable2
        )["candidateKeys"][number]
    >
>;

type ekic = KeyArrayUtil.ExtractKeysInCommon<
    typeof outerTable.candidateKeys|
    typeof outerTable2.candidateKeys
>
