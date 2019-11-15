import {IDataType} from "./data-type";

export interface DataType<TypeT> extends IDataType<TypeT> {
    /**
     * Convenience method to get a `DataType<>` that allows `NULL`.
     */
    orNull () : IDataType<TypeT|null>;
}
