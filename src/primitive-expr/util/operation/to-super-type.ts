import {PrimitiveExpr} from "../../primitive-expr";
import {ToNonNullableSuperType} from "./to-non-nullable-super-type";

export type ToSuperType<T extends PrimitiveExpr> = (
    | (
        null extends T ?
        null :
        never
    )
    | ToNonNullableSuperType<Exclude<T, null>>
);
