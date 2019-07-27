import {escapeIdentifier} from "../../../sqlstring";
import {Table} from "../../table-impl";

export type FromTableAlias<
    TableAliasT extends string
> = (
    Table<{
        lateral : false,
        tableAlias : TableAliasT,
        columns : {},
        usedRef : {},

        autoIncrement : undefined,
        id : undefined,
        primaryKey : undefined,
        candidateKeys : readonly [],

        insertEnabled : true,
        deleteEnabled : true,

        generatedColumns : readonly [],
        nullableColumns : readonly [],
        explicitDefaultValueColumns : readonly [],
        mutableColumns : readonly [],

        parents : readonly [],
    }>
);
export function fromTableAlias<
    TableAliasT extends string
> (
    tableAlias : TableAliasT
) : (
    FromTableAlias<TableAliasT>
) {
    return new Table(
        {
            lateral : false,
            tableAlias,
            columns : {},
            usedRef : {},

            autoIncrement : undefined,
            id : undefined,
            primaryKey : undefined,
            candidateKeys : [],

            insertEnabled : true,
            deleteEnabled : true,

            generatedColumns : [],
            nullableColumns : [],
            explicitDefaultValueColumns : [],
            mutableColumns : [],

            parents : [],
        },
        escapeIdentifier(tableAlias)
    );
}

/*
import * as tm from "type-mapping/fluent";
const otherTable = fromTableAlias("otherTable")
    .addColumns({
        x : () => 1,
        y : () => "str",
        wtf : () => "str"
    })
const t = fromTableAlias("test")
    .addColumns({
        x : () => 1,
        y : () => "str"
    })
    .addColumns([
        tm.boolean().withName("z"),
        tm.mysql.bigIntUnsigned().withName("b"),
    ])
    .addCandidateKey((c) => [c.x])
    //.addCandidateKey(c => [c.x])
    .addCandidateKey(c => [c.y, c.z])
    //.addCandidateKey(c => [c.y])
    //.addCandidateKey(c => [c.y, c.x])
    .addCandidateKey(c => [otherTable.columns.y])
    //.addCandidateKey(c => [c.x])
    //.addCandidateKey(c => [c.x])

//*/
