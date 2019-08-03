import * as o from "../../../../dist";

export declare const useNullable : o.IUsedRef<{
    myTable : {
        columnA : bigint|null,
    },
}>;
export const useNonNullable : o.IUsedRef<{
    myTable : {
        columnA : bigint,
    },
}> = useNullable;
