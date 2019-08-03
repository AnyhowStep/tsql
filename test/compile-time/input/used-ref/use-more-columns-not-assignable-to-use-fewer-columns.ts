import * as o from "../../../../dist";

export declare const useMore : o.IUsedRef<{
    myTable : {
        columnA : bigint,
        columnB : bigint,
    },
}>;
export const useFewer : o.IUsedRef<{
    myTable : {
        columnA : bigint,
    },
}> = useMore;
