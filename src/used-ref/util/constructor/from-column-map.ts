import {IUsedRef} from "../../used-ref";
import {TypeRefUtil} from "../../../type-ref";
import {ColumnMap} from "../../../column-map";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";

export type FromColumnMap<MapT extends ColumnMap> = (
    IUsedRef<TypeRefUtil.FromColumnMap<MapT>>
);

export function fromColumnMap<MapT extends ColumnMap> (
    map : MapT
) : (
    FromColumnMap<MapT>
) {
    const result : FromColumnMap<MapT> = {
        __contravarianceMarker : () => {},
        columns : ColumnIdentifierRefUtil.fromColumnMap(map),
    };
    return result;
}
