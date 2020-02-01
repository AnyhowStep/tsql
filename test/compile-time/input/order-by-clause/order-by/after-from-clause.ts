import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
import {SortDirection} from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
        myColumn2 : tm.mysql.boolean(),
    });

const fromClause = tsql.FromClauseUtil.from(
    tsql.FromClauseUtil.newInstance(),
    myTable
);
export const orderByClause = tsql.OrderByClauseUtil.orderBy(
    fromClause,
    undefined,
    undefined,
    undefined,
    columns => [
        /**
         * Should default to `ASC`
         */
        columns.myColumn,
    ]
);

export const orderByClause2 = tsql.OrderByClauseUtil.orderBy(
    fromClause,
    undefined,
    undefined,
    undefined,
    columns => [
        /**
         * Explicit `ASC`
         */
        columns.myColumn.asc(),
    ]
);

export const orderByClause3 = tsql.OrderByClauseUtil.orderBy(
    fromClause,
    undefined,
    undefined,
    undefined,
    columns => [
        /**
         * Explicit `DESC`
         */
        columns.myColumn.desc(),
    ]
);

export const orderByClause4 = tsql.OrderByClauseUtil.orderBy(
    fromClause,
    undefined,
    undefined,
    undefined,
    columns => [
        /**
         * Can sort either way
         */
        columns.myColumn.sort(
            Math.random() > 0.5 ?
            SortDirection.ASC :
            SortDirection.DESC
        ),
    ]
);

export const orderByClause5 = tsql.OrderByClauseUtil.orderBy(
    fromClause,
    undefined,
    undefined,
    undefined,
    columns => [
        /**
         * Should default to `ASC`
         */
        columns.myColumn.as("x"),
    ]
);

export const orderByClause6 = tsql.OrderByClauseUtil.orderBy(
    fromClause,
    undefined,
    undefined,
    undefined,
    columns => [
        /**
         * Explicit `ASC`
         */
        columns.myColumn.as("x").asc(),
    ]
);

export const orderByClause7 = tsql.OrderByClauseUtil.orderBy(
    fromClause,
    undefined,
    undefined,
    undefined,
    columns => [
        /**
         * Explicit `DESC`
         */
        columns.myColumn.as("x").desc(),
    ]
);

export const orderByClause8 = tsql.OrderByClauseUtil.orderBy(
    fromClause,
    undefined,
    undefined,
    undefined,
    columns => [
        /**
         * Can sort either way
         */
        columns.myColumn.as("x").sort(
            Math.random() > 0.5 ?
            SortDirection.ASC :
            SortDirection.DESC
        ),
    ]
);

export const orderByClause9 = tsql.OrderByClauseUtil.orderBy(
    fromClause,
    undefined,
    undefined,
    undefined,
    columns => [
        /**
         * Should default to `ASC`
         */
        tsql.and3(),
        tsql.and3(
            columns.myColumn,
        ),
        tsql.and3(
            columns.myColumn2,
        ),
        /**
         * Explicit `ASC`
         */
        tsql.and3().asc(),
        /**
         * Explicit `DESC`
         */
        tsql.and3(
            columns.myColumn,
        ).desc(),
        /**
         * Can sort either way
         */
        tsql.and3(
            columns.myColumn2,
        ).sort(
            Math.random() > 0.5 ?
            SortDirection.ASC :
            SortDirection.DESC
        )
    ]
);

export const orderByClause10 = tsql.OrderByClauseUtil.orderBy(
    fromClause,
    undefined,
    undefined,
    undefined,
    columns => [
        /**
         * Should default to `ASC`
         */
        tsql.and3().as("x"),
        tsql.and3(
            columns.myColumn,
        ).as("y"),
        tsql.and3(
            columns.myColumn2,
        ).as("z"),
        /**
         * Explicit `ASC`
         */
        tsql.and3().as("x1").asc(),
        /**
         * Explicit `DESC`
         */
        tsql.and3(
            columns.myColumn,
        ).as("y1").desc(),
        /**
         * Can sort either way
         */
        tsql.and3(
            columns.myColumn2,
        ).as("z1").sort(
            Math.random() > 0.5 ?
            SortDirection.ASC :
            SortDirection.DESC
        )
    ]
);
