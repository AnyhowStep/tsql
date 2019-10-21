import {QueryBaseUtil} from "../../../../query-base";
import {FetchAllConnection, FetchedRow} from "../../helper-type";
import {RawPaginateArgs} from "../paginate";
import {EmulatedCursorImpl} from "./emulated-cursor-impl";

export type EmulatedCursor<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
> =
    AsyncIterableIterator<FetchedRow<QueryT>>
;

/**
 * Considerations:
 * + MySQL **does not** support cursors at the protocol level
 *   + https://github.com/sidorares/node-mysql2/issues/1014
 *   + https://github.com/sidorares/node-mysql2/pull/822#issuecomment-409415308
 *   + https://github.com/sidorares/node-mysql2/blob/9404163b0dc4bdc24f6dddd18144532f41115842/lib/commands/query.js#L239
 *   + https://github.com/mysqljs/mysql/issues/274
 * + Cursors are useful for processing large amounts of data without loading everything into memory at once
 * + Cursors can prevent out-of-memory exceptions, since data is loaded in batches
 *
 * -----
 *
 * Since cursors are not natively supported (by MySQL), we emulate it using pagination.
 * So, we use the `LIMIT` and `OFFSET` clauses, and load rows in batches as we iterate.
 *
 * -----
 *
 * ### Preventing Duplicate Items
 *
 * ```ts
 *  const cursor = myQuery.emulatedCursor();
 *  for await (const row of cursor) {
 *      console.log(row);
 *      //snip operations on `row`
 *  }
 * ```
 *
 * Given the above, we might be expecting output like,
 * ```ts
 * //batch 1
 * > { rowId : 1 }
 * > { rowId : 2 }
 *
 * //batch 2
 * > { rowId : 3 }
 * > { rowId : 4 }
 *
 * //batch n
 * > etc.
 * ```
 *
 * We might actually get,
 * ```ts
 * //batch 1
 * > { rowId : 1 }
 * > { rowId : 2 }
 *
 * //batch 2
 * > { rowId : 2 } //This is a duplicate item, what gives?
 * > { rowId : 3 }
 *
 * //batch 3
 * > { rowId : 4 }
 * > { rowId : 5 }
 *
 * //batch n
 * > etc.
 * ```
 *
 * This can happen for a variety of reasons,
 * + Missing `ORDER BY` clause
 *   + Without an `ORDER BY` clause, the order that rows are returned in is undefined behaviour.
 *   + Rows are retrieved in batches and a row may appear in multiple batches.
 *   + To fix, add an `ORDER BY` clause
 *
 * + Non-unique ordering
 *   + The `ORDER BY` clause may not guarantee a unique ordering
 *   + To fix, modify the `ORDER BY` clause and guarantee a unique ordering
 *
 * + Not using a transaction
 *   + A different connection may have inserted a row into the table you are iterating over
 *
 *     The new row may have pushed other rows "down" the table,
 *     causing the next retrieved batch to contain rows already seen.
 *
 *   + To fix, use the cursor in a transaction
 *
 * + Modifying the table being iterated over
 *   + `INSERT/DELETE/UPDATE` statements may modify the table you are iterating over.
 *   + Consider buffering mutations into a temporary table first,
 *     then apply the mutations after you are done iterating.
 *   + Consider performing your mutations in a way that does not interfere with your `ORDER BY` clause.
 *
 * -----
 *
 * With an `ORDER BY` clause that guarantees a unique ordering, you can pretend the above `cursor` code is,
 * ```ts
 * declare const cursor : MyRowT[];
 * for (const row of cursor) {
 *      console.log(row);
 *      //snip operations on `row`
 * }
 * ```
 *
 * Modifying the `cursor` array may cause unexpected behaviour during iteration.
 *
 * There are ways to safely iterate and modify an array at the same time,
 * like iterating backwards while adding elements to the end of the array.
 *
 * -----
 *
 * ### Preventing Infinite Loops
 *
 * ```ts
 *  const cursor = myQuery.emulatedCursor();
 *  for await (const row of cursor) {
 *      console.log(row);
 *      const nextRowId = row.rowId+1;
 *      //INSERT INTO myTable (rowId) VALUES(:nextRowId)
 *  }
 * ```
 *
 * Given the above, it is possible for the loop to never terminate.
 * Or, rather, it will terminate after it uses all the disk space it has access to.
 *
 * -----
 *
 * The above code is similar to the following,
 * ```ts
 *  arr = [1];
 *  for (const i of arr) {
 *      console.log(i);
 *      arr.push(i+1);
 *  }
 * ```
 *
 * This will result in an infinite loop (or crash when out of memory).
 */
export function emulatedCursor<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>,
    /**
     * If set, determines the starting `page` of the cursor.
     * The `rowsPerPage` setting determines how many rows are buffered into memory at a time.
     */
    rawArgs : RawPaginateArgs = {}
) : EmulatedCursor<QueryT> {
    return new EmulatedCursorImpl<QueryT>(query, connection, rawArgs);
}
