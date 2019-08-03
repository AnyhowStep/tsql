import * as tm from "type-mapping";
import {IJoin, JoinUtil} from "../../../join";
import {IUsedRef} from "../../used-ref";

/**
 * Assumes every `IJoin` has a distinct `tableAlias`.
 */
export type FromJoin<JoinT extends IJoin> = (
    IUsedRef<{
        [tableAlias in JoinT["tableAlias"]] : (
            {
                [columnAlias in (
                    Extract<
                        keyof JoinUtil.ExtractWithTableAlias<JoinT, tableAlias>["columns"],
                        string
                    >
                )] : (
                    | tm.OutputOf<
                        JoinUtil.ExtractWithTableAlias<JoinT, tableAlias>["columns"][columnAlias]["mapper"]
                    >
                    | (
                        true extends JoinUtil.ExtractWithTableAlias<JoinT, tableAlias>["nullable"] ?
                        null :
                        never
                    )
                )
            }
        )
    }>
);
