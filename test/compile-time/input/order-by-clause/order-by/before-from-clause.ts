import * as tsql from "../../../../../dist";
import {FromClauseUtil, SortDirection} from "../../../../../dist";

export const orderByClause = tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.newInstance(),
    undefined,
    undefined,
    undefined,
    () => [
        /**
         * Should default to `ASC`
         */
        tsql.and(true, false)
    ]
);

export const orderByClause2 = tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.newInstance(),
    undefined,
    undefined,
    undefined,
    () => [
        /**
         * Explicit `ASC`
         */
        tsql.and(true, false).asc()
    ]
);

export const orderByClause3 = tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.newInstance(),
    undefined,
    undefined,
    undefined,
    () => [
        /**
         * Explicit `DESC`
         */
        tsql.and(true, false).desc()
    ]
);

export const orderByClause4 = tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.newInstance(),
    undefined,
    undefined,
    undefined,
    () => [
        /**
         * Can sort either way
         */
        tsql.and(true, false).sort(
            Math.random() > 0.5 ?
            SortDirection.ASC :
            SortDirection.DESC
        )
    ]
);

export const orderByClause5 = tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.newInstance(),
    undefined,
    undefined,
    undefined,
    () => [
        /**
         * Should default to `ASC`
         */
        tsql.and(true, false).as("x")
    ]
);

export const orderByClause6 = tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.newInstance(),
    undefined,
    undefined,
    undefined,
    () => [
        /**
         * Explicit `ASC`
         */
        tsql.and(true, false).as("x").asc()
    ]
);

export const orderByClause7 = tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.newInstance(),
    undefined,
    undefined,
    undefined,
    () => [
        /**
         * Explicit `DESC`
         */
        tsql.and(true, false).as("x").desc()
    ]
);

export const orderByClause8 = tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.newInstance(),
    undefined,
    undefined,
    undefined,
    () => [
        /**
         * Can sort either way
         */
        tsql.and(true, false).as("x").sort(
            Math.random() > 0.5 ?
            SortDirection.ASC :
            SortDirection.DESC
        )
    ]
);
