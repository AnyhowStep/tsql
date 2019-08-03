import * as o from "../../../../dist";

export declare const useFewer : o.IUsedRef<{
    myTable : {
        columnA : bigint,
    },
}>;
export const useMore : o.IUsedRef<{
    myTable : {
        columnA : bigint,
        columnB : bigint,
    },
}> = useFewer;
