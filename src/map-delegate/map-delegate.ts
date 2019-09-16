import {IConnection} from "../execution";

/**
 * Maps fetched rows from one shape to another
 *
 * + `ReturnT` may be a `Promise`.
 * + A `MapDelegate` may be `async`.
 *
 * @param row - The row's current "shape";
 * may be different from the original row if chaining `MapDelegate`s
 * @param connection - The connection to the SQL server
 * @param originalRow - The original row fetched
 */
export type MapDelegate<RowT=never, OriginalRowT=never, ReturnT=unknown> =
    (row : RowT, connection : IConnection, originalRow : OriginalRowT) => ReturnT
;
