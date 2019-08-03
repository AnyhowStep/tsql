import * as o from "../../../../dist";

export declare const useNonNullable : o.IUsedRef<{
    myTable : {
        columnA : bigint,
    },
}>;

export const useNullable : o.IUsedRef<{
    myTable : {
        columnA : bigint|null,
    },
}> = useNonNullable;
