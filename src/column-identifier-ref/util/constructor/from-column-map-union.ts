import {ColumnMap, ColumnMapUtil} from "../../../column-map";

/**
 * Combines each `ColumnMap` of the union type into
 * one `ColumnIdentifierRef`.
 *
 * Think of it as,
 * ```ts
 *  columnMapArray.reduce(
 *      (ref, columnMap) => {
 *          combine(ref, columnMap);
 *          return ref;
 *      },
 *      {}
 *  );
 * ```
 */
export type FromColumnMapUnion<ColumnMapT extends ColumnMap> = (
    {
        readonly [tableAlias in ColumnMapUtil.TableAlias<ColumnMapT>] : {
            readonly [columnAlias in ColumnMapUtil.FindWithTableAlias<
                ColumnMapT,
                tableAlias
            >["name"]] : (
                {
                    readonly tableAlias : tableAlias,
                    readonly name : columnAlias,
                }
            )
        }
    }
);