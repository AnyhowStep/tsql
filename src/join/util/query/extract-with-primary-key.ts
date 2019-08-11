import {IJoin} from "../../join";
import {Key} from "../../../key";

/**
 * Given a union of `IJoin`, it extracts the ones with the a primary key
 */
export type ExtractWithPrimaryKey<
    JoinT extends IJoin
> = (
    Extract<JoinT, { primaryKey : Key }>
    /*
    JoinT extends IJoin ?
    (
        JoinT["primaryKey"] extends Key ?
        JoinT :
        never
    ) :
    never
    //*/
);
