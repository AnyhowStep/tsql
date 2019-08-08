import {ColumnRef} from "../../column-ref";

export type HasOneTable<ColumnRefT extends ColumnRef> = (
    Extract<keyof ColumnRefT, string> extends never ?
    //Has zero tables
    false :
    string extends Extract<keyof ColumnRefT, string> ?
    //May have zero, one, or more table
    boolean :
    (
        {
            [tableAlias in Extract<keyof ColumnRefT, string>] : (
                Exclude<
                    Extract<keyof ColumnRefT, string>,
                    tableAlias
                >
            )
        }[Extract<keyof ColumnRefT, string>]
    ) extends never ?
    //Has one table
    true :
    //Has more than one table
    false
);
