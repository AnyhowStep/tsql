import {ColumnIdentifierRef} from "../../column-identifier-ref";

export type HasOneTable<RefT extends ColumnIdentifierRef> = (
    Extract<keyof RefT, string> extends never ?
    //Has zero tables
    false :
    string extends Extract<keyof RefT, string> ?
    //May have zero, one, or more table
    boolean :
    (
        {
            [tableAlias in Extract<keyof RefT, string>] : (
                Exclude<
                    Extract<keyof RefT, string>,
                    tableAlias
                >
            )
        }[Extract<keyof RefT, string>]
    ) extends never ?
    //Has one table
    true :
    //Has more than one table
    false
);
