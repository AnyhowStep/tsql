import {IJoin} from "../../join";
import * as JoinUtil from "../../util";
import {ColumnMap} from "../../../column-map";
import { TableUtil } from "../../../table";

/**
 * Given an array of `IJoin`, it extracts the ones with the a primary key
 * **null-safe** comparable to `ColumnMapT`
 */
export type ExtractWithNullSafeComparablePrimaryKey<
    JoinsT extends readonly IJoin[],
    ColumnMapT extends ColumnMap
> = (
    JoinUtil.ExtractWithNullSafeComparablePrimaryKey<JoinsT[number], ColumnMapT>
);
export function extractWithNullSafeComparablePrimaryKey<
    JoinsT extends readonly IJoin[],
    ColumnMapT extends ColumnMap
> (
    joins : JoinsT,
    columnMap : ColumnMapT
) : (
    ExtractWithNullSafeComparablePrimaryKey<JoinsT, ColumnMapT>[]
) {
    return joins.filter(
        (join) : join is ExtractWithNullSafeComparablePrimaryKey<JoinsT, ColumnMapT> => {
            if (join.primaryKey == undefined) {
                return false;
            }
            return TableUtil.hasNullSafeComparablePrimaryKey(
                {
                    columns : join.columns,
                    primaryKey : join.primaryKey,
                },
                columnMap
            );
        }
    );
}
