import * as tm from "type-mapping";
import {ITable, TableUtil} from "../../../../table";
import {Expr} from "../../../../expr";
import {UsedRefUtil} from "../../../../used-ref";
import {and} from "../../logical";
import {NullSafeComparison} from "../make-null-safe-comparison";
import {pickOwnEnumerable} from "../../../../type-util";
import {assertNullSafeComparableToCandidateKeysOfTable} from "./assert-null-safe-comparable-to-candidate-keys-of-table";
import {EqCandidateKeyOfTableDelegate} from "./eq-candidate-keys-of-table-delegate";
import {EqCandidateKeyOfTable} from "./eq-candidate-keys-of-table";

export function makeEqCandidateKeyOfTable (
    nullSafeEq : NullSafeComparison
) : (
    EqCandidateKeyOfTable
) {
    const result : EqCandidateKeyOfTable = <
        SrcT extends Pick<ITable, "columns">,
        DstT extends Pick<ITable, "columns"|"candidateKeys">,
        SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
    > (
        src : SrcT,
        dst : DstT,
        eqCandidateKeyofTableDelegate : EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
    ) : (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>
    ) => {
        const candidateKeys = TableUtil.extractCandidateKeysWithColumnAliasInTable<DstT, SrcT>(dst, src);
        const columnAliases : string[] = [];
        for (const key of candidateKeys) {
            columnAliases.push(...key);
        }

        const columns : (
            Pick<
                SrcT["columns"],
                TableUtil.ExtractCandidateKeysWithColumnAliasInTable_Input<DstT, SrcT>[number]
            >
        ) = pickOwnEnumerable(
            src.columns,
            columnAliases
        );
        const srcColumns : SrcColumnsT = eqCandidateKeyofTableDelegate(columns);
        const dstCandidateKey = assertNullSafeComparableToCandidateKeysOfTable(
            src,
            dst,
            srcColumns
        );

        /**
         * No need to `.sort()`, just use `candidateKey` and the order
         * the user set.
         */
        const arr = dstCandidateKey.map((columnAlias) => {
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

/*
import {table} from "../../../../table";
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
type s = ColumnArraysFromCandidateKeys<typeof myTable["columns"], evk>;
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
type s2 = ColumnArraysFromCandidateKeys<
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
//*/
